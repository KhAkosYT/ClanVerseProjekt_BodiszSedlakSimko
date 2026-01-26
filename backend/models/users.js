const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Users = sequelize.define('Users', {
    id:{
        type: DataTypes.INTEGER(11),
        autoIncrement: true,
        primaryKey: true
    },
    username:{
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    email:{
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    profilePicture:{
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'profilePictures/default.png'
    },
    isAdmin:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
}
,{
    tableName: 'users',
    timestamps: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_hungarian_ci'
});

module.exports = Users;