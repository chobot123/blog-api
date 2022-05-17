var express = require('express');
var router = express.Router();
var auth_controller = require('../controllers/auth_controller');

/**
 * Routers to point to the designated controller and its respective middleware functions
 * @param {String} '/...' The designated url (extending from '/api/auth)
 * @param {Function} comment_controller.[...] The middleware function that either reads, creates, removes, and refreshes the JWT's
 * @return {JSON} ... Returns whatever result from the middleware above (see controllers respository)
 */

//login (get token)
router.post('/login', auth_controller.login);

//logout (remove token)
router.delete('/logout', auth_controller.logout);

//sign up
router.post('/signup', auth_controller.signup);

//refresh token
router.post('/refresh_token', auth_controller.refresh_token);

module.exports = router;