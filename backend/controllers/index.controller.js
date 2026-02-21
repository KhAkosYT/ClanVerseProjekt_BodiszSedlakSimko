const sequelize = require("../database/sequelize");
const ClanMembers = require("../models/clanMembers");
const Clans = require("../models/clans");
const Games = require("../models/games");

const { Code500 } = require('../utils/statusCode');

exports.getFamousGames = async (req, res, next) => {
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
}

exports.getFamousClans = async (req, res, next) => {
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
}