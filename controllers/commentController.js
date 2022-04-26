var Comment = require('../models/comment');
const { body, validationResult } = require('express-validator');

//get all comments
exports.comments = function(req, res, next) {
    Comment.find()
    .sort({"timestamp": "descending"})
    .populate("user")
    .populate("post")
    .exec(function(err, comments){
        if(err) {return next(err);}
        return res.json(comments);
    })
}

//create comment
exports.comment_create = [
    body("text").trim().isLength({min: 1}).withMessage("Please Enter a Comment").escape(),

    (req, res, next) => {

        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            res.json(errors.array());
            return;
        }

        else {
            let comment = new Comment({
                user: res.locals.currentUser,
                text: req.body.text,
                //id of post page
                post: req.params.id,
            })

            comment.populate("user")
            .save(function(err, thisComment){
                if(err) {return next(err);}
                console.log("Create Comment: " + thisComment);
                return res.json(thisComment);
            })
        }
    }
];

//edit comment
exports.comment_update = [
    body("text").trim().isLength({min: 1}).withMessage("Please Enter a Comment").escape(),

    (req, res, next) => {

        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            res.json(errors.array());
            return;
        }

        else {
            let comment = new Comment({
                user: res.locals.currentUser,
                text: req.body.text,
                //id of post page
                post: req.params.id,
            })

            comment.findByIdAndUpdate(req.params.id)
            .save(function(err, thisComment){
                if(err) {return next(err);}
                console.log("Create Comment: " + thisComment);
                return res.json(thisComment);
            })
        }
    }
]

exports.comment_delete = function(req, res, next) {
    res.send('DELETE COMMENT');
}