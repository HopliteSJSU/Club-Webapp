/**
 * Module dependencies.
 */
const express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  session = require('express-session'),
  cors = require("cors"),
  passport = require("passport"),
  GooglePlusTokenStrategy = require('passport-google-plus-token');

/**
 * Dotenv evironment variables
 */
require('dotenv').config();

/**
 * Route Handler
 */

let { mailchimp, checkIn }     = require('./routes/index.js');
const media                    = require('./routes/media');
const config                   = require('./config/database'); 
const recruiters               = require('./routes/recruiters');
const googlesheet              = require('./routes/google-sheet');

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  cookieName: 'session',
  secret: 'cow_the_milk',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  resave: false,
  saveUninitialized: false,
  maxAge: 60000
}));
app.use(cors());

/**
 * Connect to Local MongoDB
 */
mongoose.connect(config.database);

/**
 * Check for MongoDB connection and error
 */
mongoose.connection.on('connected', () => {
  console.log('Connected to database ' + config.database);
})
mongoose.connection.on('error', (err) => {
  console.log('Database error: ' + err);
})

/**
 * Passport Middleware
 */
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

passport.use('googleToken',new GooglePlusTokenStrategy({
  clientID:'129086773964-42vg3lj1qos4j24nc31nv1mfj34s7m20.apps.googleusercontent.com',
  clientSecret:'0nmNPu6opdmlkc8hKKxF2BCH'
}, async(accessToken, refreshToken, profile, done)=>{
  if(profile.emails[0].value.split("@").pop() === 'sjsu.edu'){
    done(null, profile)
  }
  console.log(accessToken, refreshToken, profile)
}))

// Func to verify if user is authenitcated or not. 
function isUserAuthenticated(req, res, next) {
  if (req.user) {
      next();
  } else {
      res.send('You must login!');
  }
}

/**
 * Primary app routes.
 */
app.use(mailchimp);
app.use(checkIn);
app.use('/recruiters', recruiters);
app.use(media);
app.use('/googlesheet', googlesheet);

app.get('/auth/google', passport.authenticate('google', {
  // Required permissions
  scope: ['profile']
}));

app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('/secret');
});
// Restricted route for authenticated users
app.get('/upload', isUserAuthenticated, (req, res)=> {
  // Insert logic for resume upload, bio update etc. 
})

// Route to logout 
app.get('/logout', (req, res)=> {
  req.logout();
  res.redirect('/')
})

app.get('*', (req, res) => {
  res.redirect('http://localhost:3000/');
})


/**
 * Start Express server.
 */
let PORT = process.env.PORT || 8080;

app.listen(PORT, function() {
  console.log("NODE server listening on port " +  PORT);
});
