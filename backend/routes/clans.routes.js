const express = require('express');
const clansRouter = express.Router();

const clansController = require('../controllers/clans.controller');

const auth = require('../middleware/auth');

clansRouter.post('/', auth, clansController.createClan);

clansRouter.get('/', clansController.getAllClans);

clansRouter.get('/:id', auth, clansController.getClanById);

clansRouter.delete('/:id', auth, clansController.deleteClan);

clansRouter.put('/:id', auth, clansController.updateClan);

clansRouter.post('/:id/join', auth, clansController.joinClan);

clansRouter.post('/:id/leave', auth, clansController.leaveClan);

clansRouter.post('/:id/kick/:memberUserName', auth, clansController.kickMember);

module.exports = clansRouter;