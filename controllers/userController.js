var User = require('../models/user');
var { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var passport = require('passport');

//sign up
exports.signup_post = [

    body("username").trim().isLength({min: 6}).withMessage("Please Enter Atleast 6 Characters").escape(),
    body("password").trim().isStrongPassword().withMessage("Please Have a Minimum Length of 8, a Lowercase Letter, an Uppercase Letter, a Number, and a Symbol(@,!, etc...)")
        .escape(),
    body("confirmpassword").custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Passwords Do Not Match');
        }
        return true;
    }),

    (req, res, next) => {

        const errors = validationResult(req);

        //if there are errors, resend a json with the sanitized values
        if(!errors.isEmpty()){
            res.json({
                errors: errors.array(),
                username: req.body.username,
            })
            return;
        }
        else {
            //if username is taken return error msg
            User.find({"username": req.body.username})
            .exec(function(err, results) {
                if(err) {return next(err);}
                if(results.length > 0) {
                    let newErr = new Error('Username Already Exists');
                    return res.status(409).json({error: newErr})
                }
            })

            //make the user a hashed password
            bcrypt.hash(req.body.password, 10, (err, hashedpassword) => {
                if(err) return next(err);

                let user = new User({
                    username: req.body.username,
                    password: hashedpassword,
                });

                //create user
                user.save(function(err) {
                    if(err) {return next(err);}
                    res.status(200).json(user);
                })
            })
        }
    }
]

//login
exports.login_post = passport.authenticate('local', {
    session: true,
    successRedirect: '/',
    failureRedirect: '/login',
})

//get single user
exports.user_get = function(req, res, next) {

    User.findById(req.params.id)
    .exec(function(err, thisUser) {
        if(err) {return next(err);}
        return res.json(thisUser);
    })
}