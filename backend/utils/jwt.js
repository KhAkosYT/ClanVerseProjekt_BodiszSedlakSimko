const jwt = require('jsonwebtoken');
const config = require('../utils/config');

function createAccessToken(user){
    return jwt.sign(
        { userId: user.id,
          username: user.username,
          isAdmin: user.isAdmin
         },
        config.secretKey,
        { expiresIn: '1h' }
    );
}

function createRefreshToken(user){
    return jwt.sign(
        { userId: user.id,
          username: user.username
            },
        config.refreshSecretKey,
        { expiresIn: '1h' }

    );
}



module.exports = { createAccessToken, createRefreshToken };