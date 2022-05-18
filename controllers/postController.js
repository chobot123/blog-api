require('dotenv').config();
var Post = require('../models/post');
var Comment = require('../models/comment')
const { body, validationResult } = require('express-validator');

/**
 * Get all posts
 * 
 * @param {Object} req                  The HTTP request with properties for the request query [string, parameters, body, headers, etc.]
 * @param {Object} res                  The HTTP response that the Express app sends when it gets an HTTP request
 * @returns {JSON} posts                The JSON object list of all posts
 */

exports.posts = function(req, res) {
    Post.find()
    .sort({"timestamp": "descending"})
    .populate("user")
    .exec(function(err, posts){
        if(err){return res.json(err);}
        return res.json(posts);
    })
}

/**
 * Get a specific post
 * 
 * @param {req.body.text} text          sanitized and validated req
 * @param {Object} req                  The HTTP request with properties for the request query [string, parameters, body, headers, etc.]
 * @param {Object} res                  The HTTP response that the Express app sends when it gets an HTTP request
 * @returns {JSON} post                 The JSON object of the requested post
 */

exports.post_get = function(req, res) {
    Post.findById(req.params.id)
    .populate("user")
    .exec(function(err, post){
        if(err) {return res.send(err);}
        return res.send(post);
    })
}

/**
 * Create a post
 * 
 * @param {req.body.title} title        sanitized and validated req
 * @param {req.body.text} text          sanitized and validated req
 * @param {Object} req                  The HTTP request with properties for the request query [string, parameters, body, headers, etc.]
 * @param {Object} res                  The HTTP response that the Express app sends when it gets an HTTP request
 * @returns {JSON} thisPost             The JSON object of the created post
 */

exports.post_create = [
    
    body("title").trim().isLength({min: 1}).withMessage("Please Enter a Title").escape(),
    body("text").trim().isLength({min: 1}).withMessage("Please Enter Content"),
    
    (req, res) => {

        const errors = validationResult(req);

        if(!errors.isEmpty()){

            return res.json(errors.array());
        }

        else {
                
            let post = new Post({
                title: req.body.title,
                user: req.authData._id,
                text: req.body.text
            });

            post.save(function(err, thisPost){
                if(err) {return res.json(err);}
                return res.json(thisPost);
            })
        }
    }
];

/**
 * Publish a post
 * 
 * @param {Object} req                      The HTTP request with properties for the request query [string, parameters, body, headers, etc.]
 * @param {Object} res                      The HTTP response that the Express app sends when it gets an HTTP request
 * @returns {JSON} !results.published       Since the query returns the 'old' post, we return the opposite status
 */

exports.post_publish = function(req, res) {

    Post.findByIdAndUpdate(req.params.id, {"published": true})
    .populate("user")
    .exec(function(err, results){
        if(err){
                return res.json(err);}
        else {
            return res.send(!results.published);
        }
    })
}

/**
 * Unpublish a post
 * 
 * @param {Object} req                      The HTTP request with properties for the request query [string, parameters, body, headers, etc.]
 * @param {Object} res                      The HTTP response that the Express app sends when it gets an HTTP request
 * @returns {JSON} !results.published       Since the query returns the 'old' post, we return the opposite status
 */

exports.post_unpublish = function(req, res) {

    Post.findByIdAndUpdate(req.params.id, {"published": false})
    .populate("user")
    .exec(function(err, results){
        if(err) {return res.json(err);}
        else {
            return res.send(!results.published);
        }
    })
}

/**
 * Update a post
 * 
 * @param {req.body.title} title            sanitized and validated req
 * @param {req.body.text} text              sanitized and validated req
 * @param {Object} req                      The HTTP request with properties for the request query [string, parameters, body, headers, etc.]
 * @param {Object} res                      The HTTP response that the Express app sends when it gets an HTTP request
 * @returns {JSON} post                     Since the query returns the 'old' post, we return the opposite status
 *                  |{
 *                  |    title: req.body.title,
                    |    user: req.authData._id,
                    |    text: req.body.text, 
                    |    published: req.body.published,
                    |    _id: req.params.id,
                    |}
 */

exports.post_update = [

    body("title").trim().isLength({"min": 1}).escape(),
    body("text").trim().isLength({"min": 1}),

    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.send(errors.array());
        }

        //check if user is the same user who made the post
        let validUser = await Post.findOne({"_id": req.params.id}).populate("user");
        if(validUser.user.id !== req.authData._id){
            return res.sendStatus(404);
        }

        else {


            Post.findByIdAndUpdate(     req.params.id, 
                                    {   
                                        title: req.body.title,
                                        text: req.body.text, 
                                    }, 
                                    {
                                        new: true
                                    }
            )
            .exec(function(err, updatedPost){
                if(err) {
                    console.log(`test#2`);
                    console.log(err);
                    return res.send(err);
                }
                console.log(`test#3`);
                console.log(updatedPost);
                return res.send(updatedPost);
            })
        }
    }

]

/**
 * Delete a post
 * 
 * @param {Object} req                      The HTTP request with properties for the request query [string, parameters, body, headers, etc.]
 * @param {Object} res                      The HTTP response that the Express app sends when it gets an HTTP request
 * @returns {JSON} '...'                    JSON string confirming deletion
 */

exports.post_delete = function(req, res) {
    Post.findByIdAndDelete(req.params.id, async function(err){
        if(err) {return res.json(err);}
        Comment.findOneAndDelete({post: req.params.id}, function(err){
            if(err) {return res.status(409).send('Failed to Delete post comments')}
        })
        return res.send("Post Deleted Successfully");
    })
}