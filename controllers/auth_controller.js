require('dotenv').config();
var User = require('../models/user');
var Refresh = require('../models/refresh');
var { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var jwt = require('jsonwebtoken');

// let refreshTokens = []

// auth.post('/token', (req, res) => {
//   const refreshToken = req.body.token
//   if (refreshToken == null) return res.sendStatus(401)
//   if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403)
//     const accessToken = generateAccessToken({ name: user.name })
//     res.json({ accessToken: accessToken })
//   })
// })

//refresh token -- TESTED
exports.token_post = function(req, res) {
    const refreshToken = req.body.token;
    //check if token exists
    if(refreshToken == null) return res.sendStatus(401);
    //check if the given token is in the db
    Refresh.find({"token": refreshToken})
    .exec(function(err, foundToken) {
        if(err || foundToken.length === 0) { return res.sendStatus(403);}
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if(err) {return res.sendStatus(403);}
            //make a new access token
            const accessToken = generateAccessToken({user});
            res.json({ accessToken: accessToken});
        })
    })
}

//logout -- TESTED
exports.logout_delete = function(req,res) {
    Refresh.findOneAndDelete({"token": req.body.token})
    .exec(function(err, deletedToken){
        if(err) {return res.json(err);}
        return res.json({message: "Deletion Success: " + deletedToken});
    })
}

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
        //get access key
        const accessToken = generateAccessToken(user);
        //get refresh key
        const refreshToken = jwt.sign({user}, process.env.JWT_REFRESH_KEY, {expiresIn: '30d'});
        
        //add the refresh key to the database and return both tokens as json
        let token = new Refresh({"token": refreshToken});
        token.save(function(err) {
            if(err) {return res.sendStatus(403);}
            return res.json({
                accessToken: accessToken,
                refreshToken: refreshToken,
            })
        })
    })(req, res);
}

//sign up --TESTED
exports.signup_post = [

    body("username").trim().isLength({min: 6}).withMessage("The Username Must Have Atleast 6 Characters").escape(),
    body("password").trim().isStrongPassword().withMessage(`Please Have Atleast 8 Characters, 
                                                            a Lowercase Letter, 
                                                            an Uppercase Letter, 
                                                            a Number, 
                                                            and a Symbol(@,!, etc...)`)
        .escape(),
    body("confirmpassword").trim().custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Passwords Do Not Match');
        }
        return true;
    }),

    async (req, res) => {

        const errors = validationResult(req);

        //if there are errors, resend a json with the sanitized values
        if(!errors.isEmpty()){
            return res.status(409).json({
                errors: errors.array(),
                username: req.body.username,
            });
        }
        else {
            //if username is taken return error msg
            let userFound = await User.find({"username": req.body.username})
            if(userFound.length > 0){
                return res.status(409).json({
                    error: "Username Already Exists"
                })
            }
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
                    return res.send(user);
                })
            })
        }
    }
]

function generateAccessToken(user) {
  return jwt.sign({user}, process.env.JWT_SECRET_KEY, { expiresIn: '15s' })
}