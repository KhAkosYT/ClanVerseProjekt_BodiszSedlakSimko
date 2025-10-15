const sequelize = require('./database/sequelize');
const Users = require('./models/users');
const { Code400, Code401, Code403, Code404, Code409, Code500 } = require('./utils/statusCode');
const config = require('./utils/config');
const auth = require('./middleware/auth');
const { createAccessToken } = require('./utils/jwt');

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
//app.use(cors());


//! törölni kell ezt
app.use(express.static('public'));

sequelize.sync({ alter: true }).then(() => {
    console.log('Az adatbázis szinkronizálva.');
}).catch((err) => {
    console.error('Hiba az adatbázis szinkronizálásakor:', err);
});





app.post('/api/register', async (req, res, next) => {
    const { username, email, password } = req.body;
    if(!username || !email || !password){
        return Code400(null, req, res, next, "Hiányzó adatok.");
    }
    try {
        const existingUser = await Users.findOne({ where: { email } });
        if(existingUser){
            return Code409(null, req, res, next, "Már létező email cím.");
        }

        const hashedPassword = await bcrypt.hash(password, config.hashIterations); 

        const newUser = await Users.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: "Sikeres regisztráció.", userId: newUser.id });
    } catch (error) {
        return Code500(error, req, res, next);
    }
});

app.post('/api/login', async (req, res, next) => {
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
        res.status(200).json({ message: "Sikeres bejelentkezés.", userId: user.id, token });
    } catch (error) {
        return Code500(error, req, res, next);
    }
});


app.get('/tokentest', auth, (req, res) => {
    res.json({ message: "Sikeres hozzáférés a védett erőforráshoz.", user: req.user });
});


app.listen(config.serverPort, () => {
    console.log(`Szerver elindult! http://localhost:${config.serverPort}`);
});
