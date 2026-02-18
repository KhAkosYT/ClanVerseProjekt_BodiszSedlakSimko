const Users = require('../models/users');

const { Code400, Code401, Code404, Code409, Code500 } = require('../utils/statusCode');
const config = require('../utils/config');
const { createAccessToken } = require('../utils/jwt');

const bcrypt = require('bcrypt');

exports.register = async (req, res, next) => {
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
}

exports.login = async (req, res, next) => {
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
}

exports.logout = (req, res) => {
    res.status(200).json({ message: "Sikeres kijelentkezés." });
}

exports.getProfile = async (req, res, next) => {
    const { userId } = req.user;

    const userData = await Users.findByPk(userId);
    if(!userData){
        return Code404(null, req, res, next,"Nem található felhasználó");
    }

    res.status(200).json({ userName: userData.username, email: userData.email, profilePicture: userData.profilePicture });
}

exports.updateProfile = async (req, res, next) => {
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
}