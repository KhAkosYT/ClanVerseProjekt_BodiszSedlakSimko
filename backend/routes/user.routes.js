const express = require('express');
const usersRouter = express.Router();

const userController = require('../controllers/user.controller');

const uploadPfp = require('../middleware/uploadPfp');
const auth = require('../middleware/auth');

usersRouter.post('/register', uploadPfp, userController.register);

usersRouter.post('/login', userController.login);

usersRouter.post('/logout', auth, userController.logout);

usersRouter.get('/profile', auth, userController.getProfile);

usersRouter.put('/profile', auth, uploadPfp, userController.updateProfile);

module.exports = usersRouter;