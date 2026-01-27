const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Games = sequelize.define('Games', {
    id: {
        type: DataTypes.INTEGER(11),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    gameName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true
    },
    logo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'gameLogos/gameNotFound.jpg'
    }
}, {
    tableName: 'games',
    timestamps: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_hungarian_ci'
});

module.exports = Games;
