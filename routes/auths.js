var express = require('express');
var router = express.Router();
var auth_controller = require('../controllers/auth_controller');

// router.post('/token', auth_controller.token_post);

//login (get token)
router.post('/login', auth_controller.login_post);
//logout (remove token)
router.delete('/logout', auth_controller.logout_delete);
//sign up
router.post('/signup', auth_controller.signup_post);
//refresh token
router.post('/token', auth_controller.token_post);

module.exports = router;