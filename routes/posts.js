var express = require('express');
var router = express.Router();

var post_controller = require('../controllers/postController');

//GET -- ALL POSTS  //
router.get('/posts', post_controller.posts);

//GET -- SINGLE POST
router.get('/posts/:id', post_controller.post_get);

//POST -- CREATE POST
router.post('/posts', post_controller.post_create);

//POST -- PUBLISH POST
router.post('/posts/:id/publish', post_controller.post_publish);

//POST -- UNPUBLISH POST
router.post('/posts/:id/unpublish', post_controller.post_unpublish);

//PUT -- UPDATE POST
router.put('/posts/:id/edit', post_controller.post_update);

//DELETE -- DELETE POST
router.delete('/posts/:id', post_controller.post_delete);

module.exports = router;