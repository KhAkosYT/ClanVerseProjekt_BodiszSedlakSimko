const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const ClanMembers = sequelize.define('ClanMembers', {
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
    role: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'member'
    }
}, {
    tableName: 'clan_members',
    timestamps: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_hungarian_ci'
});

const Users = require('./users');
const Clans = require('./clans');
ClanMembers.belongsTo(Users, { foreignKey: 'userId', as: 'user' });
Users.hasMany(ClanMembers, { foreignKey: 'userId', as: 'clanMemberships' });
ClanMembers.belongsTo(Clans, { foreignKey: 'clanId', as: 'clan' });
Clans.hasMany(ClanMembers, { foreignKey: 'clanId', as: 'members' });

module.exports = ClanMembers;