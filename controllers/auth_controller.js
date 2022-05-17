require('dotenv').config();
var User = require('../models/user');
var Refresh = require('../models/refresh');
var { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var jwt = require('jsonwebtoken');

/**
 * Checks if the HTTP request comes with a valid (In DB and exists) refresh token, decodes the refresh token, validates
 * the information from the decoded token, and issues a new refresh and access token
 * 
 * @param {Object} req The HTTP request with properties for the request query [string, parameters, body, headers, etc.]
 * @param {Object} res The HTTP response that the Express app sends when it gets an HTTP request
 * @returns {JSON}      {accessToken,
                            user: { _id: user._id, 
                                    username: user.username
                                } 
                            }
 */

exports.refresh_token = async function(req, res) {

    const token = req.cookies.refreshToken;
    let checkValid = await Refresh.find({"token": token});

    //Deletes the access/refresh token if there's no token or the token doesn't exist in the DB
    if(!token || checkValid.length === 0) {
        res.clearCookie("refreshToken");
        return res.send({ accessToken: ''});
    }

    /**
     * Verifies the refresh token and if theres an error, revoke the access token
     * 
     * @param {Object} token                        The refresh token from the request cookies
     * @param {String} process.env.JWT_REFRESH_KEY  The secret key validating the refresh token
     * @param {Object} err                          The error parameter of the CB function 
     * @param {Object} user                         The decoded token object parameter of the CB function
      */

    jwt.verify(token, process.env.JWT_REFRESH_KEY, (err, user) => {

        //if there is an error ?=== no refresh token/wrong refresh token, delete tokens
        if(err) {
            Refresh.findOneAndDelete({"token": token})
            .exec();
            res.clearCookie("refreshToken");
            return res.send({ accessToken: ''});
        }

        // Checks if user exists in the DB, and if it doesn't, revoke access
        User.find({"username": user.username})
        .exec((err, user) => {
            if(err || !user) {
                res.clearCookie("refreshToken");
                return res.send({ accessToken: ''});
            }
        })

        // New access and refresh tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

    

        // 6) Update in DB
        Refresh.findOneAndUpdate(
            {
                "token": token,
            },
            {
                "token": refreshToken,
            }
        )
        .exec((err) => {
            if(err) {
                res.clearCookie("refreshToken");
                return res.send({ accessToken: ''});
            }
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            path: 'api/auth/refresh_token',
            secure: false,
        })

        res.send({
            accessToken,
            user: {_id: user._id, username: user.username} 
        });
        
    })
}


/**
 * Checks the DB for the refresh token found in the request cookies and if found, deletes the refresh token in the DB and cookies
 * 
 * @param {Object} req The HTTP request with properties for the request query [string, parameters, body, headers, etc.]
 * @param {Object} res The HTTP response that the Express app sends when it gets an HTTP request
 * @returns {JSON} {    
                        message: 'Logged Out'
                    }
 */

exports.logout = function(req,res) {

    Refresh.findOneAndDelete({"token": req.cookies.refreshToken})
    .exec(function(err){
        if(err) {return res.json(err);}
        res.clearCookie('refreshToken', { path: 'api/auth/refresh_token'})
        return res.send(
            {   
                message: 'Logged Out'
            });
    })
}

/**
 * Decodes the request body (username, password) and checks if the information matches from the database (see local strategy in app.js)
 * and gives the user an accessToken/refreshToken and passes the user's information 
 * 
 * @param {Object} req The HTTP request with properties for the request query [string, parameters, body, headers, etc.]
 * @param {Object} res The HTTP response that the Express app sends when it gets an HTTP request
 * @returns {JSON} {    
                        accessToken,
                        user: {  
                                username: user.username,
                                _id: user._id
                            } 
                    }
 */
            
exports.login = function(req, res) {
    
    //authenticate if the username and password is valid
    passport.authenticate('local', {session: false}, (err, user) => {
        if(err || !user) {

            res.status(409).json({
                msg: "Username and/or Password is Incorrect",
            });
            return;
        }

        //If there is a pre-existing refreshtoken in the cookies, delete said token
        if(req.cookies.refreshToken){
            Refresh.findOneAndDelete({"token": req.cookies.refreshToken})
            .exec();
        }

        //get access key
        const accessToken = generateAccessToken(user);

        //get refresh key
        const refreshToken = generateRefreshToken(user);
        
        //add the refresh key to the database and return both tokens as json
        let token = new Refresh({"token": refreshToken});
        token.save(function(err) {
            
            if(err) {return res.sendStatus(409);}
            
            //send the accesstoken and user info and refreshtoken (but as cookie)
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: 'api/auth/refresh_token',
                secure: false,
            });

            res.send({
                accessToken,
                user: {  
                         username: user.username,
                         _id: user._id
                      } 
            });

        })
    })(req, res);
}

/**
 * Sanitizes and validates the req.body parameters and adds to the user databas
 * @param {req.body.username} username sanitized and validated req 
 * @param {req.body.password} password sanitized and validated req
 * @param {Object} req                 The validated values of the parameters above
 * @param {Object} res                 The HTTP response that the Express app sends when it gets an HTTP request
 * @returns {JSON} user                The user data
 */

exports.signup = [

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

        let userFound = await User.find({"username": req.body.username});

        // error Updates posts and redirects to the 'dashboard' urlvalidation
        if(!errors.isEmpty() || userFound.length > 0) {

            if(!errors.isEmpty() && userFound.length > 0) {
                return res.status(409).send({
                    errors: errors.array(),
                    error: {
                        msg: "Username Already Exists"
                    }
                })
            }
            else if(!errors.isEmpty()) {
                return res.status(409).send({
                    errors: errors.array(),
                });
            }
            else if(userFound.length > 0) {
                return res.status(409).send({
                    error: {
                        msg: "Username Already Exists"
                    }
                })
            }
        }
            
        else {

            //make the user a hashed password
            bcrypt.hash(req.body.password, 10, (err, hashedpassword) => {
                if(err) return next(err);

                //create a user model with the hashed password
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

//----- HELPER FUNCTIONS TO GENERATE AN ACCESS TOKEN AND REFRESH TOKEN ------//

function generateAccessToken(user) {
  return jwt.sign({_id: user._id, username: user.username}, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
}

function generateRefreshToken(user) {
    return jwt.sign({_id: user._id, username: user.username}, process.env.JWT_REFRESH_KEY, {expiresIn: '24h'});
}