const Clans = require('../models/clans');
const ClanMembers = require('../models/clanMembers');
const Games = require('../models/games');
const Users = require('../models/users');

const { Code400, Code401, Code403, Code404, Code409, Code500 } = require('../utils/statusCode'); 

const auth = require('../middleware/auth');

exports.createClan = async (req, res, next) => {
    const { clanName, gameId, description } = req.body;

    const { userId } = req.user;

    if(!clanName || !gameId){
        return Code400(null, req, res, next, "Hiányzó adatok.");
    }

    try{
        const existingClan = await Clans.findOne({ where: { name: clanName}});
        if(existingClan){
            return Code409(null, req, res, next, "Már létezik ilyen néven klán.");
        }

        const newClan = await Clans.create({ name: clanName, gameId, description, createrId: userId, ownerId: userId});
        const newClanMember = await ClanMembers.create({ clanId: newClan.id, userId: userId, role: "leader" });

        res.status(201).json({ message: "Klán létrehozva" });
    }
    catch(err){
        return Code500(err, req, res, next, "Hiba történt a klán létrehozása során");
    }
}

exports.getAllClans = async (req, res, next) => {
    try {
        const gameFilter = req.query.game;
        let clansData;

        if (gameFilter) {
            const numericId = Number(gameFilter);
            if (Number.isNaN(numericId) || !Number.isInteger(numericId) || numericId <= 0) {
                return Code400(null, req, res, next, "A 'game' query paramnek numerikus game id-nek kell lennie.");
            }

            clansData = await Clans.findAll({ 
                where: { gameId: numericId }, 
                include: [{ model: Games, as: 'game', attributes: ['id', 'gameName'] }] 
            });
        } else {
            clansData = await Clans.findAll({ 
                include: [{ model: Games, as: 'game', attributes: ['id', 'gameName'] }] 
            });
        }

        const clans = clansData.map(clan => ({
            id: clan.id,
            name: clan.name,
            gameId: clan.gameId,
            gameName: clan.game ? clan.game.gameName : null,
            description: clan.description
        }));

        res.status(200).json(clans);
    } catch (err) {
        return Code500(err, req, res, next);
    }
}

exports.getClanById = async (req, res, next) => {
    const { userId } = req.user;

    try {
        const { id } = req.params;
        const clan = await Clans.findByPk(id);

        if (!clan) {
            return Code404("Nincs ilyen klán", req, res, next);
        }

        const clanMembersRecords = await ClanMembers.findAll({ where: { clanId: clan.id } });
        const allClanMembers = {};
        for (const member of clanMembersRecords) {
            const clanmemberId = member.userId;
            const clanMemberName = await Users.findByPk(clanmemberId);
            if (clanMemberName) {
                allClanMembers[clanmemberId] = {
                    name: clanMemberName.username,
                    role: member.role
                };
            }
        }


        const clanGameName = await Games.findByPk(clan.gameId);


        const isLeader = await ClanMembers.findOne({ where: { clanId: clan.id, userId: userId, role: "leader" } });
        const isMember = await ClanMembers.findOne({ where: { clanId: clan.id, userId: userId } });
        
        const clanData = {
            id: clan.id,
            name: clan.name,
            gameName: clanGameName.gameName,
            gameLogo: clanGameName.logo,
            description: clan.description,
            allMembers: Object.values(allClanMembers),
        };

        if (isLeader) {
            res.status(200).json({ clanData, editable: true });
            return;
        }

        if (isMember) {
            res.status(200).json({ clanData, canJoin: false });
        }

          

        res.status(200).json({ clanData, canJoin: true });
    } catch (err) {
        console.error(err);
        return Code500(err, req, res, next);
    }
}

exports.deleteClan = async (req, res, next) => {
    try{
        const { id } = req.params;
        const { userId } = req.user;

        const clan = await Clans.findByPk(id);
        
        if(!clan){
            return Code404("Nincs ilyen klán", req, res, next);
        }

        const isLeader = await ClanMembers.findOne({ where: { userId: userId, role: "leader" }});

        if(!isLeader){
            return Code403("Nincs jogosultságod a klán törléséhez", req, res, next);
        }

        await Clans.destroy({ where: { id } });
        res.status(200).json({ message: "Klán törölve." });
    }
    catch(err){
        console.error("Hiba a klántörlése során:" + err);
        return Code500(err, req, res, next, "Hiba a klántörlése során:");
    }
}

exports.updateClan = async (req, res, next) => {
    try{
        const { userId } = req.user;
        const { id } = req.params;
        const { newClanName, newClanGame, newClanDescription } = req.body;


        const clan = await Clans.findByPk(id);

        if(!clan){
            return Code404("Nincs ilyen klán", req, res, next);
        }

        const isLeader = await ClanMembers.findOne({ where: { userId: userId, clanId: id, role: "leader" }});

        if(!isLeader){
            return Code403("Nincs jogosultságod a klán módosításához", req, res, next);
        }

        if(newClanName && newClanName != clan.name ){
            clan.name = newClanName;
        }
        if(newClanGame && newClanGame != clan.gameId){
            clan.gameId = newClanGame;
        }
        if(newClanDescription && newClanDescription != clan.description){
            clan.description = newClanDescription;
        }

        await clan.save();
        res.status(200).json({ message: "Klán frissítve.", clan })
    }
    catch(err){
        console.error("Hiba történt a klán módosítása során: " + err)
        return Code500(err, req, res, next)
    }
}

exports.joinClan = async (req, res, next) => {
    try{
        const { userId } = req.user;
        const { id } = req.params;

        const clan = await Clans.findByPk(id);
        if(!clan){
            return Code404("Nincs ilyen klán", req, res, next);
        }

        const isMember = await ClanMembers.findOne({ where: { clanId: id, userId: userId }});
        if(isMember){
            return Code409("Konfliktus: Már tagja vagy a klánnak", req, res, next);
        }

        const joinToClan = await ClanMembers.create({ clanId: id, userId: userId });
        res.status(200).json({ message: "Sikeresen csatlakoztál a klánhoz" })
    }catch(err){
        console.error("Hiba a belepes soran", err);
        return Code500(err, req, res, next);
    }
}

exports.leaveClan = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;

        const clan = await Clans.findByPk(id);
        if (!clan) {
            return Code404(null, req, res, next, "Nincs ilyen klán");
        }

        const memberLeaving = await ClanMembers.findOne({ where: { clanId: id, userId: userId } });
        if (!memberLeaving) {
            return Code403(null, req, res, next, "Nem vagy tagja ennek a klánnak.");
        }

        if (memberLeaving.role === 'leader') {
            const oldestMember = await ClanMembers.findOne({
                where: {
                    clanId: id,
                    userId: { [Op.ne]: userId }
                },
                order: [['createdAt', 'ASC']]
            });

            if (oldestMember) {
                const newLeaderId = oldestMember.userId;

                await clan.update({ ownerId: newLeaderId });
                await oldestMember.update({ role: 'leader' });
            } else {

                await ClanMembers.destroy({ where: { clanId: id } });
                await Clans.destroy({ where: { id: id } });
                return res.status(200).json({ message: "Kiléptél, és mivel egyedül voltál, a klán törölve lett." });
            }
        }
        await memberLeaving.destroy();

        return res.status(200).json({ message: "Sikeresen kiléptél a klánból" });
    } catch (err) {
        console.error("Hiba történt a klánból való kilépés során", err);
        return Code500(err, req, res, next);
    }
}

exports.kickMember = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { id, memberUserName } = req.params;

        const clan = await Clans.findByPk(id);
        if(!clan){
            return Code404("Nem található ilyen klán", req, res, next);
        }

        const isLeader = await ClanMembers.findOne({ where: { clanId: id, userId: userId, role: 'leader'}});
        if(!isLeader){
            return Code401("Nincs jogosultságod a tagok kirúgásához", req, res, next);
        }

        const user = await Users.findOne({ where: { username: memberUserName } });
        if(!user){
            return Code404("Nem található a felhasználó", req, res, next);
        }
        
        const member = await ClanMembers.findOne({ where: { clanId: id, userId: user.id}});
        if(!member){
            return Code404("Az adott felhasználó nem tagja a klánnak.");
        }

        await member.destroy();
        
        res.status(200).json({ message: `Sikeresen kirúgtad ${memberUserName} nevű játékost!` });

    } catch (err) {
        console.log("Hiba a kirúgás során", err);
        return Code500(err, req, res, next);
    }
}