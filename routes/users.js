var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');

//POST -- SIGNUP FORM
router.post('/sign-up', user_controller.signup_post);

//POST -- LOGIN FORM
router.post('/login', user_controller.login_post);

//GET -- SINGLE USER
router.get('/:id', user_controller.user_get);

module.exports = router;
