const express = require('express');
const router = express.Router();
const {register, login, refreshToken, logOut} = require('../controllers/auth.controller');


router.post('/register', register);
router.post('/login', login);
router.get('/refresh_token', refreshToken);
router.post('/logout', logOut);

module.exports = router