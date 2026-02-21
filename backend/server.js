//adatbázis impor-ok
const sequelize = require('./database/sequelize');

//utils import-ok
const config = require('./utils/config');


//seed import(-ok) //? Még nem tudom, hogy egy fájlban lesz-e minden seed, vagy minden táblára lesz külön-külön
const seedGames = require('./seeds/gamesSeed');
const seedUsers = require('./seeds/usersSeed');
const seedClans = require('./seeds/clansSeed');
const seedClanMembers = require('./seeds/clanMembersSeed');
const seedMessages = require('./seeds/messagesSeed');

//App import-ok
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { path } = require('path');

//routerek
const usersRouter = require('./routes/user.routes');
const clansRouter = require('./routes/clans.routes');
const gamesRouter = require('./routes/game.routes');
const messagesRouter = require('./routes/messages.routes');
const indexRouter = require('./routes/index.routes');
const adminRouter = require('./routes/admin.routes');

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

app.use('/api/games', gamesRouter)

app.use('/api/messages', messagesRouter)

app.use('/api', indexRouter)

app.use('/api/admin', adminRouter)


app.listen(config.serverPort, () => {
    console.log(`Szerver elindult! http://localhost:${config.serverPort}`);
});
    