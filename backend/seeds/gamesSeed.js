const fs = require('fs');
const path = require('path');
const sequelize = require('../database/sequelize');
const Games = require('../models/games');

async function seedGames() {
    try {
        const filePath = path.join(__dirname, '../data/games.txt');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const gameNames = fileContent
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        await sequelize.sync();

        for (const name of gameNames) {
            await Games.findOrCreate({
                where: { gameName: name }
            });
        }

        console.log(`Sikeres feltöltés! (${gameNames.length} játék)`);
    } catch (err) {
        console.error('Hiba a seedelés során:', err);
        throw err;
    }
}

module.exports = seedGames;
