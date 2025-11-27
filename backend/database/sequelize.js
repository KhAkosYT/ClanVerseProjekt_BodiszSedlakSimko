const { Sequelize } = require('sequelize');
const config = require('../utils/config');

const sequelize = new Sequelize(
    config.db.name,
    config.db.username,
    config.db.password,
    {
        host: config.db.host,
        dialect: config.db.dialect,
        logging: console.log,

        timezone: '+01:00',

        dialectOptions: {
            charset: 'utf8mb4',
            useUTC: false,
            dateStrings: true,
            typeCast: true,
        },

        define: {
            timestamps: true,
            collate: 'utf8mb4_hungarian_ci',
        },
    }
);

sequelize
    .authenticate()
    .then(() => {
        console.log('Siker:', config.db.name);
    })
    .catch(err => {
        console.error('Nem sikerült a kapcsolat:', err);
    });

module.exports = sequelize;
