const express = require('express');
const adminRouter = express.Router();

const adminController = require('../controllers/admin.controller');

const auth = require('../middleware/auth');
const uploadGameLogo = require('../middleware/uploadGameLogo');

adminRouter.get('/is-admin', auth,adminController.isAdmin);

adminRouter.post('/upload-game', auth, uploadGameLogo, adminController.uploadGame);

module.exports = adminRouter;