const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/verify', userController.verify);
router.post('/logout', userController.logout);

module.exports = router;