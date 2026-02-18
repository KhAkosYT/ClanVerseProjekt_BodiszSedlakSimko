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

//routerek
const usersRouter = require('./routes/user.routes');
const clansRouter = require('./routes/clans.routes');

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

//router-ek haszálata
app.use('/api/users', usersRouter);

app.use('/api/clans', clansRouter)



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
