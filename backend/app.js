/**
 * Module dependencies.
 */
const express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  session = require('express-session'),
  cors = require("cors"),
  passport = require("passport");

/**
 * Dotenv evironment variables
 */
require('dotenv').config();

/**
 * Route Handler
 */
let { mailchimp, checkIn } = require('./routes/index.js');
const media = require('./routes/media');
const config = require('./config/database');
const users = require('./routes/users');

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

/**
 * Primary app routes.
 */
app.use(mailchimp);
app.use(checkIn);
app.use(media);
app.use('/users', users);

app.get('*', (req, res) => {
  res.redirect('http://localhost:3000/');
})

/**
 * Start Express server.
 */
let PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
  console.log("NODE server listening on port " + PORT);
});
