const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const clanMessages = sequelize.define('clanMessages', {
    id: {
        type: DataTypes.INTEGER(11),
        autoIncrement: true,
        primaryKey: true
    },
    clanId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
            model: 'clans',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    userId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'clan_messages',
    timestamps: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_hungarian_ci'
});