var Comment = require('../models/comment');
const { body, validationResult } = require('express-validator');

//get all comments
exports.comments = function(req, res) {
    Comment.find({"post": req.params.post_id})
    .sort({"timestamp": "descending"})
    .exec(function(err, comments){
        if(err) {return res.send(err);}
        console.log(comments);
        return res.send(comments);
    })
}

//create comment
exports.comment_create = [
    body("username").trim().isLength({min: 3}).withMessage("Please Enter a Username").escape(),
    body("text").trim().isLength({min: 1}).withMessage("Please Enter a Comment").escape(),

    (req, res) => {
        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return res.status(409).send(errors.array());
        }
        else {
            console.log(req.params);
            let comment = new Comment({
                username: req.body.username,
                text: req.body.text,
                post: req.params.post_id,
            })

            console.log(comment);
            comment.save(function(err, thisComment){
                if(err) {return res.send(err);}
                console.log("Create Comment: " + thisComment);
                return res.send(thisComment);
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

exports.comment_delete = function(req, res) {
    Comment.findByIdAndDelete(req.params.id, function(err, deletedComment){
        if(err) {return res.send(err);}
        return res.json("This Comment Has Been Deleted");
    })
}