var express = require('express');
var router = express.Router();

var post_controller = require('../controllers/postController');

// GET -- ALL POSTS //
router.get('/', post_controller.posts);

//GET -- SINGLE POST
router.get('/:id', post_controller.post_get);

module.exports = router;
