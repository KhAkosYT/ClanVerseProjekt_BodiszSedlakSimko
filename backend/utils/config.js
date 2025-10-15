const dotenv = require('dotenv');
dotenv.config();

const config = {
    devMode: process.env.ENVIRONMENT ? Boolean(process.env.ENVIRONMENT) : false,
    db:{
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        dialect: process.env.DB_DIALECT || 'mariadb',
        name: process.env.DB_NAME || 'clanverse',
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
    },
    secretKey: process.env.SECRET_KEY,
    refreshSecretKey: process.env.REFRESH_SECRET_KEY,
    serverPort: process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT, 10) : 3000,
    hashIterations: process.env.HASHITERATIONS ? parseInt(process.env.HASHITERATIONS, 10) : 10,
}

// console.log("Konfiguráció:");
// console.log(config);

module.exports = config;