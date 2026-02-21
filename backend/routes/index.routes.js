const express = require('express');
const indexRouter = express.Router();

const indexController = require('../controllers/index.controller');

indexRouter.get('/famous-games', indexController.getFamousGames);

indexRouter.get('/famous-clans', indexController.getFamousClans);

module.exports = indexRouter;