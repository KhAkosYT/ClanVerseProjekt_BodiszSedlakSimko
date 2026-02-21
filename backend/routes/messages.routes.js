const express = require('express');
const messagesRouter = express.Router();

const messagesController = require('../controllers/messages.controller');

const auth = require('../middleware/auth');

messagesRouter.post('/:clanId', auth, messagesController.createMessageByClanId);

messagesRouter.get('/:clanId', auth, messagesController.getMessagesByClanId);

module.exports = messagesRouter;