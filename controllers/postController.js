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

//get one post
exports.post_get = function(req, res, next) {
    Post.findById(req.params.id)
    .populate("user")
    .exec(function(err, post){
        if(err) {return next(err);}
        return res.json(post);
    })
}

//create post
exports.post_create = [
    
    body("title").trim().isLength({min: 1}).withMessage("Please Enter a Title").escape(),
    body("text").trim().isLength({min: 1}).withMessage("Please Enter Content").escape(),
    
    (req, res, next) => {

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.json(errors.array());
            return;
        }

        else {
            let post = new Post({
                title: req.body.title,
                user: res.locals.currentUser,
                text: req.body.text
            });

            post.populate("user")
            .save(function(err, thisPost){
                if(err) {return next(err)}
                console.log("Create Post: ", thisPost);
                return res.json(thisPost);
            })
        }
    }
];

exports.post_publish = function(req, res, next) {
    Post.findByIdAndUpdate(req.params.id, {"published": true}, function(err, results){
        if(err){return next(err);}
        else {
            return res.json("Published Post: " + results);
        }
    })
}

exports.post_unpublish = function(req, res, next) {
    Post.findByIdAndUpdate(req.params.id, {"published": false}, function(err, results){
        if(err) {return next(err);}
        else {
            return res.json("Unpublished Post: " + results);
        }
    })
}

//update post
exports.post_update = [
    body("title").trim().isLength({"min": 1}).escape(),
    body("text").trim().isLength({"min": 1}).escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.send(errors.array());
        }

        else {

            let post = new Post({
                title: req.body.title,
                user: res.locals.currentUser,
                text: req.body.text, 
                published: req.body.published,
                _id: req.params.id,
            })

            Post.findByIdAndUpdate(req.params.id, post)
            .populate("user")
            .exec(function(err, results){
                if(err) {return next(err);}
                return res.json(results);
            })
        }
    }

]

//delete post
exports.post_delete = function(req, res, next) {
    Post.findByIdAndDelete(req.params.id, function(err){
        if(err) {return next(err);}
        return res.json("Post Deleted Successfully");
    })
}