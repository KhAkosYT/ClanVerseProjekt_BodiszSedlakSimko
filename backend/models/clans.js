const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Clans = sequelize.define('Clans', {
    id: {
        type: DataTypes.INTEGER(11),
        autoIncrement: true,
        primaryKey: true
    },
    ownerId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE', //* Ha a felhasználó törlésre kerül, a klánjai is törlődnek (később ez nem így lesz)
        onUpdate: 'CASCADE'
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    game: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
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

module.exports = Clans;