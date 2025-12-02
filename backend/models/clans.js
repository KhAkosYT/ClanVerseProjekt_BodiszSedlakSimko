const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Clans = sequelize.define('Clans', {
    id: {
        type: DataTypes.INTEGER(11),
        autoIncrement: true,
        primaryKey: true
    },
    createrId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    },
    ownerId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    gameId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: {
            model: 'games',
            key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    },
    description: {
        type: DataTypes.STRING(1000),
        allowNull: true
    }
}, {
    tableName: 'clans',
    timestamps: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_hungarian_ci'
});

const Users = require('./users');
Clans.belongsTo(Users, { foreignKey: 'ownerId', as: 'owner' });
Users.hasMany(Clans, { foreignKey: 'ownerId', as: 'ownedClans' });

const Games = require('./games');
Clans.belongsTo(Games, { foreignKey: 'gameId', as: 'game' });
Games.hasMany(Clans, { foreignKey: 'gameId', as: 'clans' });

module.exports = Clans;
