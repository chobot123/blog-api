require('dotenv').config();
var User = require('../models/user');
var { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var jwt = require('jsonwebtoken');

//get single user -- TESTED
exports.user_get = function(req, res) {
    
    User.findById(req.params.id)
    .exec(function(err, thisUser) {
        if(err) {return res.json(err);}
        return res.json(thisUser);
    })
}