/**
 * Module dependencies.
 */
const express         = require("express"),
      mongoose        = require("mongoose"),
      bodyParser      = require("body-parser"),
      session         = require('express-session'),
      cors            = require("cors");

/**
 * Dotenv evironment variables
 */
require('dotenv').config();

/**
 * Route Handler
 */
let { mailchimp, checkIn }     = require('./routes/index.js');

/**
 * Create Express server.
 */
let app = express();

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
 * Primary app routes.
 */
app.use(mailchimp);
app.use(checkIn);
/**
 * Start Express server.
 */
let PORT = process.env.PORT || 8080;
app.listen(PORT, function() {
  console.log("NODE server listening on port " +  PORT);
});
