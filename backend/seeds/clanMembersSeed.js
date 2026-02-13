const fs = require('fs');
const path = require('path');
const ClanMembers = require('../models/clanMembers');

async function seedClanMembers() {
    try {
        const filePath = path.join(__dirname, '../data/clanMembers.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const clanMembersList = JSON.parse(fileContent);

        const count = await ClanMembers.count();
        if (count >= clanMembersList.length) {
            return;
        }

        for (const memberInfo of clanMembersList) {
            const member = await ClanMembers.findOrCreate({
                where: { clanId: memberInfo.clanId, userId: memberInfo.userId },
                defaults: {
                    clanId: memberInfo.clanId,
                    userId: memberInfo.userId,
                    role: memberInfo.role,
                    createdAt: memberInfo.createdAt,
                    updatedAt: memberInfo.updatedAt
                }
            });
        }

        console.log(`Sikeres feltöltés! (${clanMembersList.length} klántag)`);
    } catch (err) {
        console.error('Hiba a klán tagok seedelése során:', err);
        throw err;
    }
}

module.exports = seedClanMembers;