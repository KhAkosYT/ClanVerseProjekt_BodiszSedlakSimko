const express = require('express');
const gamesRouter = express.Router();

const gamesController = require('../controllers/game.controller');

gamesRouter.get('/', gamesController.getGames);

module.exports = gamesRouter;