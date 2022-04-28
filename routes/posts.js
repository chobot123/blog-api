var express = require('express');
var router = express.Router();
var verifyToken = require('../verifyToken');

var post_controller = require('../controllers/postController');
var commentsRouter = require('../routes/comments');

//GET -- ALL POSTS  //
router.get('/', post_controller.posts);

//GET -- SINGLE POST
router.get('/:id', post_controller.post_get);

//POST -- CREATE POST
router.post('/', verifyToken, post_controller.post_create);

//POST -- PUBLISH POST
router.post('/:id/publish', verifyToken, post_controller.post_publish);

//POST -- UNPUBLISH POST
router.post('/:id/unpublish', verifyToken, post_controller.post_unpublish);

//PUT -- UPDATE POST
router.put('/:id/edit', verifyToken, post_controller.post_update);

//DELETE -- DELETE POST
router.delete('/:id', verifyToken, post_controller.post_delete);

// ----- COMMENTS ----- //
router.use('/:post_id/comments', commentsRouter);

module.exports = router;