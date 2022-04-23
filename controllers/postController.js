var Post = require('../models/post');
const { body, validationResult } = require('express-validator');


//get all posts, sorted (recent => latest)
exports.posts = function(req, res, next) {
    Post.find()
    .sort({"timestamp": "descending"})
    .populate("user")
    .exec(function(err, posts){
        if(err){return next(err);}
        return res.json(posts);
    })
}

exports.post_get = function(req, res, next) {
    Post.findById(req.params.id)
    .exec(function(err, post){
        if(err) {return next(err);}
        return res.json(post);
    })
}