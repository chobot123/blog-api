require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var passportJWT = require('passport-jwt');
var JWTStrategy = passportJWT.Strategy;
var ExtractJWT = passportJWT.ExtractJwt;
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var User = require('./models/user');
var cors = require('cors');
// var commentsRouter = require('./routes/comments');
var authRouter = require('./routes/auths');

var auth = express();

//Mongoose Connection
var mongoDB = process.env.MONGODB_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
auth.set('views', path.join(__dirname, 'views'));
auth.set('view engine', 'pug');
auth.use(logger('dev'));
auth.use(express.json());
auth.use(express.urlencoded({ extended: false }));
auth.use(cookieParser());
auth.use(express.static(path.join(__dirname, 'public')));
auth.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
},
));

//set up localstrategy
passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) { 
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        
        bcrypt.compare(password, user.password, (err,res) => {
          if(res) {
            return done(null ,user);
          }
          else {
            return done(null, false, { message: "Incorrect Password"})
          }
        })
      });
    })
  );

auth.use('/api/auth', authRouter);

passport.use(new JWTStrategy({

  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey : process.env.JWT_SECRET_KEY,
},
function (jwtPayload, done) {
  return done(null, jwtPayload);
}
));

// catch 404 and forward to error handler
auth.use(function(req, res, next) {
  next(createError(404));
});

module.exports = auth;
