var express = require('express');
var router = express.Router({mergeParams: true});
var comment_controller = require('../controllers/commentController');
var verifyToken = require('../verifyToken');

/**
 * Routers to point to the designated controller and its respective middleware functions (CRUD)
 * @param {String} '/...' The designated url (extending from '/api/posts/:post_id/comments via mergeParams)
 * @param {Function} verifyToken The middleware function designed to verify the JWT --access token-- on request **OPTIONAL**
 * @param {Function} comment_controller.[...] The middleware function that either creates, reads, updates, or deletes in the comment_controller
 * @return {JSON} ... Returns whatever result from the middleware above (see controllers respository)
 */

//GET -- ALL COMMENTS 
router.get('/', comment_controller.comments);

//POST -- CREATE A COMMENT
router.post('/create', comment_controller.comment_create);

//PUT -- UPDATE COMMENT
router.put('/:id/edit', verifyToken, comment_controller.comment_update);

//DELETE -- DELETE COMMENT
router.delete('/:id/delete', verifyToken, comment_controller.comment_delete);

module.exports = router;