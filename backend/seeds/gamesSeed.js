const fs = require('fs');
const path = require('path');
const sequelize = require('../database/sequelize');
const Games = require('../models/games');

async function seedGames() {
    try {
        // A fájl kiterjesztése .json lesz az átnevezés után
        const filePath = path.join(__dirname, '../data/games.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const gamesList = JSON.parse(fileContent);

        await sequelize.sync();

        for (const gameInfo of gamesList) {
            const [game, created] = await Games.findOrCreate({
                where: { gameName: gameInfo.gameName },
                defaults: {
                    logo: gameInfo.logo
                }
            });

            // Ha már létezett a játék, de a logója nem egyezik (pl. default volt), frissítjük
            if (!created && game.logo !== gameInfo.logo) {
                game.logo = gameInfo.logo;
                await game.save();
            }
        }

        console.log(`Sikeres feltöltés! (${gamesList.length} játék)`);
    } catch (err) {
        console.error('Hiba a seedelés során:', err);
        throw err;
    }
}

module.exports = seedGames;
