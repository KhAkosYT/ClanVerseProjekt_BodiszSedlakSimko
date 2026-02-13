const fs = require('fs');
const path = require('path');
const Message = require('../models/messages');

async function seedMessages() {
    try {
        const filePath = path.join(__dirname, '../data/messages.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const messagesList = JSON.parse(fileContent);

        const count = await Message.count();
        if (count >= messagesList.length) {
            return;
        }

        for (const messageInfo of messagesList) {
            const message = await Message.findOrCreate({
                where: { text: messageInfo.text },
                defaults: {
                    clanId: messageInfo.clanId,
                    userId: messageInfo.userId,
                    text: messageInfo.text,
                    createdAt: messageInfo.createdAt,
                    updatedAt: messageInfo.updatedAt
                }
            });
        }

        console.log(`Sikeres feltöltés! (${messagesList.length} üzenet)`);
    } catch (err) {
        console.error('Hiba az üzenetek seedelés során:', err);
        throw err;
    }
}

module.exports = seedMessages;