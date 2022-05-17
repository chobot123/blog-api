var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');

/**
 * Routers to point to the designated controller and its respective middleware function(s)
 * @param {String} '/...' The designated url (extending from '/api/users)
 * @param {Function} user_controller.user_get The middleware function that gets the data of a single user from the DB
 * @return {JSON} ... Returns whatever result from the middleware above (see controllers respository)
 */

//GET -- SINGLE USER
router.get('/:id', user_controller.user_get);

module.exports = router;
