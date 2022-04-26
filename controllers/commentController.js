var Comment = require('../models/comment');
const { body, validationResult } = require('express-validator');

//get all comments
exports.comments = function(req, res) {
    Comment.find({"post": req.params.post_id})
    .sort({"timestamp": "descending"})
    .populate("user")
    .exec(function(err, comments){
        if(err) {return res.json(err);}
        return res.json(comments);
    })
}

//create comment
exports.comment_create = [
    body("text").trim().isLength({min: 1}).withMessage("Please Enter a Comment").escape(),

    (req, res) => {

        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return res.json(errors.array());
        }

        else {
            let comment = new Comment({
                user: res.locals.currentUser,
                text: req.body.text,
                post: req.params.post_id,
            })

            comment.populate("user")
            .save(function(err, thisComment){
                if(err) {return res.json(err);}
                console.log("Create Comment: " + thisComment);
                return res.json(thisComment);
            })
        }
    }
];

//edit comment
exports.comment_update = [

    body("text").trim().isLength({min: 1}).withMessage("Please Enter a Comment").escape(),

    (req, res) => {

        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return res.json(errors.array());
        }

        else {
            let comment = new Comment({
                user: res.locals.currentUser,
                text: req.body.text,
                post: req.params.post_id,
            })

            Comment.findByIdAndUpdate(req.params.id, comment,
                function(err, updatedComment){
                    if(err) {return res.json(err);}
                    return res.json(updatedComment);
                }
            )
        }
    }
]

exports.comment_delete = function(req, res) {
    Comment.findByIdAndDelete(req.params.id, function(err, deletedComment){
        if(err) {return res.json(err);}
        return res.json("This Comment Has Been Deleted");
    })
}