const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const Users = require('../models/users');
const config = require('../utils/config');

async function seedUsers() {
    try{
        const filePath = path.join(__dirname, '../data/users.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const usersList = JSON.parse(fileContent);

        const count = await Users.count();
        if (count === usersList.length) {
            return;
        }

        for (const userInfo of usersList) {

            const user = await Users.findOrCreate({
                where: { username: userInfo.username },
                defaults: {
                    username: userInfo.username,
                    email: userInfo.email,
                    password: await bcrypt.hash(userInfo.password, config.hashIterations),
                    isAdmin: userInfo.isAdmin || false,
                    profilePicture: userInfo.profilePicture,
                    createdAt: userInfo.createdAt,
                    updatedAt: userInfo.updatedAt
                }
            });

            if (!created) {
                await user.update({
                    email: userInfo.email,
                    password: await bcrypt.hash(userInfo.password, config.hashIterations),
                    isAdmin: userInfo.isAdmin || false,
                    profilePicture: userInfo.profilePicture,
                    createdAt: userInfo.createdAt,
                    updatedAt: userInfo.updatedAt
                });
            }
        }

        console.log(`Sikeres feltöltés! (${usersList.length} felhasználó)`);
    } catch (err) {
        console.error('Hiba a seedelés során:', err);
        throw err;
    }
}

module.exports = seedUsers;