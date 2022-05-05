require('dotenv').config();
var User = require('../models/user');
var Refresh = require('../models/refresh');
var { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var jwt = require('jsonwebtoken');

//refresh token -- TESTED
exports.refresh_token = async function(req, res) {
    //1) Get refresh token
    const token = req.cookies.refreshToken;
    //2)IF there is no refresh token then 'invalidate' access token
    if(!token) return res.send({ accessToken: '' })

    //3)Verify the token
    jwt.verify(token, process.env.JWT_REFRESH_KEY, (err, user) => {
        //if there is an error ?=== no refresh token/wrong refresh token
        //so find in db and delete

        if(err) {
            Refresh.findOneAndDelete({"token": token})
            .exec();

            return res.send({accessToken: ''});
        }

        //4) check if the user exists in the db and if he doesn't or there is
        //an error then we invalidate the access token
        User.find({"username": user.username})
        .exec((err, user) => {
            if(err || !user) return res.send({ accessToken: ''});
        })

        //5) So we know USER exists and TOKEN exists, 
        //   Let's create a new refresh and access token
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
            if(err) return res.send({accessToken: ''});
        })

        //7) Send tokens
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            path: 'api/auth/refresh_token',
            secure: false,
        })

        return res.send({
            accessToken
        });
        
    })
}


//logout -- TESTED
exports.logout = function(req,res) {
    // console.log(res.cookies.refreshToken);
    Refresh.findOneAndDelete({"token": req.cookies.refreshToken})
    .exec(function(err){
        if(err) {return res.json(err);}
        res.clearCookie('refreshToken', { path: 'api/auth/refresh_token'})
        return res.send(
            {   
                refreshToken: req.cookies.refreshToken,
                message: 'Logged Out'
            });
    })
}

//login -- TESTED
exports.login = function(req, res) {
    
    //authenticate if password is good
    passport.authenticate('local', {session: false}, (err, user) => {
        if(err || !user) {
            return res.status(401).json({
                message: "Username or Password is Incorrect",
                // user : user,
            });
        }
        //get access key
        const accessToken = generateAccessToken(user);

        //get refresh key
        const refreshToken = generateRefreshToken(user);
        
        //add the refresh key to the database and return both tokens as json
        let token = new Refresh({"token": refreshToken});
        token.save(function(err) {
            
            if(err) {return res.sendStatus(403);}
            
            //send the accesstoken and user info and refreshtoken (but as cookie)
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: 'api/auth/refresh_token',
                secure: false,
            });

            res.send({
                accessToken,
                user: user, 
            });

        })
    })(req, res);
}

//sign up --TESTED
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
                    error: {
                        msg: "Username Already Exists"
                    }
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
  return jwt.sign({user}, process.env.JWT_SECRET_KEY, { expiresIn: '5m' })
}

function generateRefreshToken(user) {
    return jwt.sign({user}, process.env.JWT_REFRESH_KEY, {expiresIn: '24h'});
}