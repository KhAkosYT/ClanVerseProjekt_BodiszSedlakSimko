

const Games = require('../models/games');

const { Code400, Code403, Code409, Code500 } = require('../utils/statusCode');

exports.isAdmin = async (req, res, next) => {
    const { userId, isAdmin } = req.user;
    res.status(200).json({ isAdmin });
}

exports.uploadGame = async (req, res, next) => {
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
}