var express = require('express');
var router = express.Router();

var comment_controller = require('../controllers/commentController');

// ----- COMMENTS ----- //

//GET -- ALL COMMENTS 
router.get('/', comment_controller.comments);

//POST -- CREATE A COMMENT
router.post('/create', comment_controller.comment_create);

//PUT -- UPDATE COMMENT
router.put('/:id/edit', comment_controller.comment_update);

//DELETE -- DELETE COMMENT
router.delete('/:id/delete', comment_controller.comment_delete);

module.exports = router;