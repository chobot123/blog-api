var express = require('express');
var router = express.Router();
var auth_controller = require('../controllers/auth_controller');


//login (get token)
router.post('/login', auth_controller.login);

//logout (remove token)
router.delete('/logout', auth_controller.logout);

//sign up
router.post('/signup', auth_controller.signup);

//refresh token
router.post('/refresh_token', auth_controller.refresh_token);

module.exports = router;