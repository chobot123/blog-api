require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('cookie-session');
var passport = require('passport');
var passportJWT = require('passport-jwt');
var JWTStrategy = passportJWT.Strategy;
var ExtractJWT = passportJWT.ExtractJwt;
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var User = require('./models/user');
var cors = require('cors');


//routers
var postsRouter = require('./routes/posts');
var commentsRouter = require('./routes/comments');
var authRouter = require('./routes/auths');

//CORS configuration
var app = express();
app.use(cors());

//Mongoose Connection
var mongoDB = process.env.MONGODB_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, "./client/build")));

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

//set up JWT 
passport.use(new JWTStrategy({

  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey : process.env.JWT_SECRET_KEY,
},
function (jwtPayload, done) {
  return done(null, jwtPayload);
}
));


passport.serializeUser(function(user, done) {
  done(null, user.id);
})

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  })
})


app.use(session({secret: 'cats', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

//routers
app.use('/api/posts', postsRouter);
app.use('/api/posts/:post_id/comments', commentsRouter);
app.use('/api/auth', authRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


