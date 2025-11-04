const jwt = require('jsonwebtoken');
const config = require('../utils/config');

const { Code401 } = require('../utils/statusCode');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) {
        return Code401(null, req, res, next, "Nincs jogosultsága a felhasználónak (nincs token).");
    }

    const parts = authHeader.split(' ');
    if(parts.length !== 2 || parts[0] !== 'Bearer'){
        return Code401(null, req, res, next, "Nincs jogosultsága a felhasználónak (hibás token).");
    }

    const token = parts[1];
    if(!config.secretKey){
        console.warn('Nincs beállítva a SECRET_KEY környezeti változó! (utils/config.js)');
    }

    try{
        const payload = jwt.verify(token, config.secretKey);
        req.user = payload;
        next();
    }catch(err){
        if(err.name === 'TokenExpiredError'){
            return Code401(null, req, res, next, "Nincs jogosultsága a felhasználónak (lejárt token).");
        }
        return Code401(err, req, res, next, "Nincs jogosultsága a felhasználónak (érvénytelen token).");
    }
};