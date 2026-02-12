const fs = require('fs');
const path = require('path');
const Clans = require('../models/clans');

async function seedClans() {
    try {
        const filePath = path.join(__dirname, '../data/clans.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const clansList = JSON.parse(fileContent);

        const count = await Clans.count();
        if (count === clansList.length) {
            return;
        }

        for (const clanInfo of clansList) {
            const clan = await Clans.findOrCreate({
                where: { name: clanInfo.name },
                defaults: {
                    name: clanInfo.name,
                    createrId: clanInfo.createrId,
                    ownerId: clanInfo.ownerId,
                    gameId: clanInfo.gameId,
                    description: clanInfo.description,
                    createdAt: clanInfo.createdAt,
                    updatedAt: clanInfo.updatedAt
                }
            });
        }

        console.log(`Sikeres feltöltés! (${clansList.length} klán)`);
    } catch (err) {
        console.error('Hiba a klánok seedelése során:', err);
        throw err;
    }
}

module.exports = seedClans;