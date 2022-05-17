var Comment = require('../models/comment');
const { body, validationResult } = require('express-validator');

/**
 * Get all comments from a specific post
 * 
 * @param {Object} req      The HTTP request with properties for the request query [string, parameters, body, headers, etc.]
 * @param {Object} res      The HTTP response that the Express app sends when it gets an HTTP request
 * @returns {JSON} comments The object list of all said comments
 */

exports.comments = function(req, res) {
    Comment.find({"post": req.params.post_id})
    .sort({"timestamp": "descending"})
    .exec(function(err, comments){
        if(err) {return res.status(409).send(err);}
        console.log(comments);
        return res.send(comments);
    })
}

/**
 * Creates a comment
 * 
 * @param {req.body.username} username  sanitized and validated req 
 * @param {req.body.text} text          sanitized and validated req
 * @param {Object} req                  The HTTP request with properties for the request query [string, parameters, body, headers, etc.]
 * @param {Object} res                  The HTTP response that the Express app sends when it gets an HTTP request
 * @returns {JSON} thisComment          The JSON object of the created comment
 *                     | {
 *                     |    username: req.body.username,
 *                     |    text: req.body.text,
 *                     |    post: req.params.post_id,
 *                     |    timestamp: Date.now(),
 *                     | }
 */

exports.comment_create = [

    body("username").trim().isLength({min: 3}).withMessage("Please Enter a Username").escape(),
    body("text").trim().isLength({min: 1}).withMessage("Please Enter a Comment").escape(),

    (req, res) => {
        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return res.status(409).send(errors.array());
        }
        else {

            let comment = new Comment({
                username: req.body.username,
                text: req.body.text,
                post: req.params.post_id,
            })

            comment.save(function(err, thisComment){
                if(err) {return res.send(err);}
                return res.send(thisComment);
            })
        }
    }
];

/**
 * Updates a comment 
 * 
 * @param {req.body.text} text          sanitized and validated req
 * @param {Object} req                  The HTTP request with properties for the request query [string, parameters, body, headers, etc.]
 * @param {Object} res                  The HTTP response that the Express app sends when it gets an HTTP request
 * @returns {JSON} updatedComment       The JSON object of the updated comment
 *                     | {
 *                     |    user: req.body.username,
 *                     |    text: req.body.text,
 *                     |    post: req.params.post_id,
 *                     |    timestamp: Date.now(),
 *                     | }
 */

exports.comment_update = [

    body("text").trim().isLength({min: 1}).withMessage("Please Enter a Comment").escape(),

    (req, res) => {
        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return res.send(errors.array());
        }

        else {
            let comment = new Comment({
                user: res.locals.currentUser,
                text: req.body.text,
                post: req.params.post_id,
            })

            Comment.findByIdAndUpdate(req.params.id, comment,
                function(err, updatedComment){
                    if(err) {return res.send(err);}
                    return res.send(updatedComment);
                }
            )
        }
    }
]

/**
 * Deletes a comment 
 * 
 * @param {Object} req        The HTTP request with properties for the request query [string, parameters, body, headers, etc.]
 * @param {Object} res        The HTTP response that the Express app sends when it gets an HTTP request
 * @returns {JSON} '...'      JSON string confirming deletion
 */

exports.comment_delete = function(req, res) {
    Comment.findByIdAndDelete(req.params.id, function(err, deletedComment){
        if(err) {return res.send(err);}
        return res.json("This Comment Has Been Deleted");
    })
}