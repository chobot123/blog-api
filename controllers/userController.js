require('dotenv').config();
var User = require('../models/user');
var { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var jwt = require('jsonwebtoken');

//sign up --TESTED
// exports.signup_post = [

//     body("username").trim().isLength({min: 6}).withMessage("Please Enter Atleast 6 Characters").escape(),
//     body("password").trim().isStrongPassword().withMessage("Please Have a Minimum Length of 8, a Lowercase Letter, an Uppercase Letter, a Number, and a Symbol(@,!, etc...)")
//         .escape(),
//     body("confirmpassword").trim().custom((value, {req}) => {
//         if(value !== req.body.password) {
//             throw new Error('Passwords Do Not Match');
//         }
//         return true;
//     }),

//     async (req, res) => {

//         const errors = validationResult(req);

//         //if there are errors, resend a json with the sanitized values
//         if(!errors.isEmpty()){
//             return res.json({
//                 errors: errors.array(),
//                 username: req.body.username,
//             });
//         }
//         else {
//             //if username is taken return error msg
//             let userFound = await User.find({"username": req.body.username})
//             if(userFound.length > 0){
//                 return res.status(409).json({
//                     error: "Username Already Exists"
//                 })
//             }
//             //make the user a hashed password
//             bcrypt.hash(req.body.password, 10, (err, hashedpassword) => {
//                 if(err) return next(err);

//                 let user = new User({
//                     username: req.body.username,
//                     password: hashedpassword,
//                 });

//                 //create user
//                 user.save(function(err) {
//                     if(err) {return next(err);}
//                     return res.send(user);
//                 })
//             })
//         }
//     }
// ]

//login -- TESTED
exports.login_post = function(req, res) {

    //authenticate if password is good
    passport.authenticate('local', {session: false}, (err, user) => {
        if(err || !user) {
            return res.status(401).json({
                message: "Username or Password is Incorrect",
                user : user,
            });
        }

        //generate a signed web token with the user obj and return in res
        jwt.sign(
            {user}, 
            process.env.JWT_SECRET_KEY, 
            {expiresIn: "1h"}, 
            (err, token) => {
                if(err) {return res.json(err);}
                return res.json({
                    token, 
                    user
                });
            }
        );
    })(req, res);
}

//get single user -- TESTED
exports.user_get = function(req, res) {
    
    User.findById(req.params.id)
    .exec(function(err, thisUser) {
        if(err) {return res.json(err);}
        return res.json(thisUser);
    })
}