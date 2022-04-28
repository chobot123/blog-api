var express = require('express');
var router = express.Router();

var comment_controller = require('../controllers/commentController');
var verifyToken = require('../verifyToken');

// ----- COMMENTS ----- //

//GET -- ALL COMMENTS 
router.get('/', comment_controller.comments);

//POST -- CREATE A COMMENT
router.post('/create', verifyToken, comment_controller.comment_create);

//PUT -- UPDATE COMMENT
router.put('/:id/edit', verifyToken, comment_controller.comment_update);

//DELETE -- DELETE COMMENT
router.delete('/:id/delete', verifyToken, comment_controller.comment_delete);

module.exports = router;