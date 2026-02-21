const { Op } = require("sequelize");

const Games = require("../models/games");

const { Code500 } = require('../utils/statusCode');

exports.getGames = async (req, res, next) => {
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
}