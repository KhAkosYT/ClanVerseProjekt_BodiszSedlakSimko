const fs = require('fs');
const path = require('path');
const Games = require('../models/games');

async function seedGames() {
    try {
        const filePath = path.join(__dirname, '../data/games.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const gamesList = JSON.parse(fileContent);

        const count = await Games.count();
        if (count === gamesList.length) {
            return;
        }

        for (const gameInfo of gamesList) {
            const createGames = await Games.findOrCreate({
                where: { gameName: gameInfo.gameName },
                defaults: {
                    logo: gameInfo.logo
                }
            });
        }

        console.log(`Sikeres feltöltés! (${gamesList.length} játék)`);
    } catch (err) {
        console.error('Hiba a játékok seedelés során:', err);
        throw err;
    }
}

module.exports = seedGames;
