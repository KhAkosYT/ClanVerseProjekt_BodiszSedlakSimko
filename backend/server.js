//adatbázis impor-ok
const sequelize = require('./database/sequelize');
const Users = require('./models/users');
const Clans = require('./models/clans');
const ClanMembers = require('./models/clanMembers');
const Games = require('./models/games');
const ClanMessages = require('./models/messages');

//utils import-ok
const { Code400, Code401, Code403, Code404, Code409, Code500 } = require('./utils/statusCode');
const config = require('./utils/config');
const { createAccessToken } = require('./utils/jwt');


//seed import(-ok) //? Még nem tudom, hogy egy fájlban lesz-e minden seed, vagy minden táblára lesz külön-külön
const seedGames = require('./seeds/gamesSeed');
const seedUsers = require('./seeds/usersSeed');
const seedClans = require('./seeds/clansSeed');
const seedClanMembers = require('./seeds/clanMembersSeed');
const seedMessages = require('./seeds/messagesSeed');


//middleware import-ok
const auth = require('./middleware/auth');
const uploadPfp = require('./middleware/uploadPfp');
const uploadGameLogo = require('./middleware/uploadGameLogo');

//App import-ok
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { path } = require('path');

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: 'http://localhost:4200',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    })
);


//! törölni kell ezt
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

sequelize.sync().then(async () => {
    console.log('Az adatbázis szinkronizálva.');

    //! Első futtatáskor kell csak
    await seedGames();
    await seedUsers();
    await seedClans();
    await seedClanMembers();
    await seedMessages();
}).catch((err) => {
    console.error('Hiba az adatbázis szinkronizálásakor:', err);
});



app.post('/api/users/register', uploadPfp, async (req, res, next) => {
    const { username, email, password } = req.body;
    if(!username || !email || !password){
        return Code400(null, req, res, next, "Hiányzó adatok.");
    }
    try {
        const existingUser = await Users.findOne({ where: { email } });
        if(existingUser){
            return Code409(null, req, res, next, "Már létezik ezzel az email címmel fiók.");
        }

        const hashedPassword = await bcrypt.hash(password, config.hashIterations);

        if(req.file){
            const newUser = await Users.create({ username, email, password: hashedPassword, profilePicture: 'profilePictures/' + req.file.filename });
            return  res.status(201).json({ message: "Sikeres regisztráció."});
        }

        const newUser = await Users.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: "Sikeres regisztráció."});
    } catch (error) {
        return Code500(error, req, res, next);
    }
});

app.post('/api/users/login', async (req, res, next) => {
    const { username, password } = req.body;
    if(!username || !password){
        return Code400(null, req, res, next, "Hiányzó adatok.");
    }
    try {
        const user = await Users.findOne({ where: { username } });
        if(!user){
            return Code401(null, req, res, next, "Hibás felhasználónév vagy jelszó.");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return Code401(null, req, res, next, "Hibás felhasználónév vagy jelszó.");
        }
        const token = createAccessToken(user);
        res.status(200).json({ message: "Sikeres bejelentkezés.", token });
    } catch (error) {
        return Code500(error, req, res, next);
    }
});

app.post('/api/users/logout', auth, (req, res) => {
    res.status(200).json({ message: "Sikeres kijelentkezés." });
});

app.get('/api/users/profile', auth, async(req, res, next) => {
    const { userId } = req.user;

    const userData = await Users.findByPk(userId);
    if(!userData){
        return Code404(null, req, res, next,"Nem található felhasználó");
    }

    res.status(200).json({ userName: userData.username, email: userData.email, profilePicture: userData.profilePicture });
});

app.put('/api/users/profile', auth, uploadPfp, async (req, res, next) => {
    const { userId } = req.user;

    const { newUserName, newEmail, currPass, newPass } = req.body;

    const userData = await Users.findByPk(userId);
    if(!userData){
        return Code404(null, req, res, next,"Nem található felhasználó");
    }

    const isPasswordValid = await bcrypt.compare(currPass, userData.password);
    if(!isPasswordValid){
        return Code401(null, req, res, next, "Hibás jelszó.");
    }

    if(newUserName && newUserName != userData.username){
        userData.username = newUserName;
    }
    if(newEmail && newEmail != userData.email){
        userData.email = newEmail;
    }
    if(isPasswordValid && newPass && newPass != currPass){
        userData.password = await bcrypt.hash(newPass, config.hashIterations);
    }

    if(req.file){
        userData.profilePicture = 'profilePictures/' + req.file.filename;
    }

    await userData.save();
    res.status(200).json({ message: "Profil frissítve" });

});

app.post('/api/clans', auth, async (req, res, next) => {
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
});

app.get('/api/clans', async (req, res, next) => {
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
});


app.get('/api/clans/:id', auth, async (req, res, next) => {
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
            gameName: clanGameName ? clanGameName.gameName : null,
            description: clan.description,
            allMembers: Object.values(allClanMembers),
        };

        if (isLeader) {
            res.status(200).json({ clanData, editable: true });
        }

        if (isMember) {
            res.status(200).json({ clanData, canJoin: false });
        }

          

        res.status(200).json({ clanData, canJoin: true });
    } catch (err) {
        console.error(err);
        return Code500(err, req, res, next);
    }
});

app.delete('/api/clans/:id', auth, async (req, res, next) => {
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
});

app.put('/api/clans/:id', auth, async (req, res, next) => {
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
});

app.post('/api/clans/:id/join', auth, async (req, res, next) => {
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
});

app.post('/api/clans/:id/leave', auth, async (req, res, next) => {
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
});

app.post('/api/clans/:id/kick/:memberUserName', auth, async (req, res, next) => {
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
});

app.get('/api/games', async (req, res, next) => {
    try {
        const search = req.query.search || '';
        let games;
        if (search) {
            games = await Games.findAll({
                where: {
                    gameName: { [Op.like]: `%${search}%` }
                },
                attributes: ['id', 'gameName']
            });
        } else {
            games = await Games.findAll({ attributes: ['id', 'gameName'] });
        }
        res.json({ games: games.map(g => ({ id: g.id, name: g.gameName })) });
    } catch (err) {
        console.error("Hiba történt a játékok lekérdezése során", err);
        return Code500(err, req, res, next);
    }
});

app.get('/api/messages/:clanId', auth, async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { clanId } = req.params;

        const isMember = await ClanMembers.findOne({ where: { clanId: clanId, userId: userId } });
        if (!isMember) {
            return Code403("Nincs jogosultságod a klán üzeneteinek lekéréséhez", req, res, next);
        }

        const clanMessagesArray = await ClanMessages.findAll({ where: { clanId: clanId } });

        const clanData = await Clans.findByPk(clanId);
        if (!clanData) {
            console.error("Nem található ilyen klán", err);
            return Code404("Nem található ilyen klán", req, res, next);
        }

        const messages = [];
        for (let messageData of clanMessagesArray) {
            const messageSenderUserId = messageData.userId;
            const messageSenderUserData = await Users.findByPk(messageSenderUserId);
            if (messageSenderUserData) {
                messages.push({
                    sender: messageSenderUserData.username,
                    message: messageData.text,
                    time: messageData.createdAt
                });
            }
        }

        res.status(200).json({ clanName: clanData.name ,messages });
    } catch (err) {
        console.error("Hiba történt a klán üzenetének lekérése során", err);
        return Code500("Hiba történt a klán üzenetének lekérése során", req, res, next);
    }
});

app.post('/api/messages/:clanId', auth, async (req, res, next) => {
    try{
        const { clanId } = req.params;
        const { userId } = req.user;

        //! FONTOS HOGY NE LEGYEN ELIRAS A FRONTENDEN.
        const message = req.body.message;

        const isMember = await ClanMembers.findOne({ where: { clanId: clanId, userId: userId }});
        if(!isMember){
            return Code403("Nincs jogosultságod Üzenetet küldeni az adott klánba", req, res, next);
        }

        const clanData = await Clans.findByPk(clanId);
        if(!clanData){
            console.error("Nem található ilyen klán");
            return Code404("Nem található ilyen klán", req, res, next);
        }

        ClanMessages.create({ clanId: clanId, userId: userId, text: message });

        res.status(200).json({ message: "Sikeres üzenetküldés "});

    }catch(err){
        console.error("Hiba történt az üzenet elküldése során");
        return Code500("Hiba történt az üzenet elküldése során", req, res, next);
    }
});


//* Index oldal API végpontjai
app.get('/api/famous-games', async (req, res, next) => {
    try {
        const famousGamesData = await Clans.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('Clans.gameId')), 'totalGameCount']
            ],
            include: [{
                model: Games,
                as: 'game',
                attributes: ['id', 'gameName', 'logo'],
                required: true
            }],
            group: ['game.id', 'game.gameName'],
            order: [[sequelize.literal('totalGameCount'), 'DESC']],
            limit: 5
        });

        const games = famousGamesData.map(item => ({
            id: item.game.id,
            gameName: item.game.gameName,
            logo: item.game.logo,
            totalGameCount: parseInt(item.get('totalGameCount'), 10)
        }));

        res.status(200).json({ games });
    } catch (err) {
        console.error("Hiba történt a híres játékok lekérdezése során", err);
        return Code500(err, req, res, next);
    }
});

app.get('/api/famous-clans', async (req, res, next) => {
    try {
        const famousClansData = await ClanMembers.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('ClanMembers.clanId')), 'totalClanCount']
            ],
            include: [{
                model: Clans,
                as: 'clan',
                attributes: ['id', 'name'],
                required: true,
                include: [{
                    model: Games,
                    as: 'game',
                    attributes: ['gameName', 'logo']
                }]
            }],
            group: ['clan.id', 'clan.name', 'clan.game.id', 'clan.game.gameName', 'clan.game.logo'],
            order: [[sequelize.literal('totalClanCount'), 'DESC']],
            limit: 5
        });
        const clans = famousClansData.map(item => ({
            id: item.clan.id,
            clanName: item.clan.name,
            gameName: item.clan.game.gameName,
            gameLogo: item.clan.game.logo,
            currentClanMembersCount: parseInt(item.get('totalClanCount'), 10)
        }));
        res.status(200).json({ clans });
    } catch (err) {
        console.error("Hiba történt a híres klánok lekérdezése során", err);
        return Code500(err, req, res, next);
    }
});

app.get('/api/admin/is-admin', auth, async (req, res, next) => {
    const { userId, isAdmin } = req.user;
    res.status(200).json({ isAdmin });
});


app.post('/api/admin/upload-game', auth, uploadGameLogo, async (req, res, next) => {
    const { userId, isAdmin } = req.user;
    const { gameName } = req.body;
    if(!isAdmin){
        return Code403(null, req, res, next, "Nincs jogosultságod a játék feltöltéséhez.");
    }
    try {
        if (!gameName) {
            return Code400(null, req, res, next, "Hiányzó adatok.");
        }
        const existingGame = await Games.findOne({ where: { gameName } });
        if (existingGame) {
            return Code409(null, req, res, next, "Már létezik ilyen néven játék.");
        }
        let logoPath = 'gameLogos/gameNotFound.jpg';
        if (req.file) {
            logoPath = 'gameLogos/' + req.file.filename;
        }
        const newGame = await Games.create({ gameName, logo: logoPath });
        res.status(201).json({ message: "Játék sikeresen hozzáadva.", game: { id: newGame.id, gameName: newGame.gameName, logo: newGame.logo } });
    } catch (error) {
        return Code500(error, req, res, next);
    }
});



//! Törölni kell ezt is
app.get('/tokentest', auth, (req, res) => {
    res.json({ message: "Sikeres hozzáférés a védett erőforráshoz.", user: req.user });
});


app.listen(config.serverPort, () => {
    console.log(`Szerver elindult! http://localhost:${config.serverPort}`);
});
