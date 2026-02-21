const ClanMembers = require("../models/clanMembers");
const Clans = require("../models/clans");
const ClanMessages = require("../models/messages");
const Users = require("../models/users");

const { Code403, Code404, Code500 } = require('../utils/statusCode');

exports.getMessagesByClanId = async (req, res, next) => {
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

        res.status(200).json({ clanName: clanData.name, messages });
    } catch (err) {
        console.error("Hiba történt a klán üzenetének lekérése során", err);
        return Code500("Hiba történt a klán üzenetének lekérése során", req, res, next);
    }
}

exports.createMessageByClanId = async (req, res, next) => {
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
}