/**
 * Module for handling recruiter registration and authentication
 */
const express   = require('express'),
      router    = express.Router(),
      passport  = require('passport'),
      jwt       = require('jsonwebtoken'),
      config    = require('../config/database');
const User = require('../models/user');

//Validate email and password
const { check, validationResult } = require("express-validator/check");

/**
 * Registration Route
 */
router.post('/register', [
    check('email', "Invalid Email").isEmail(),
    check('password', "Password must be at least 8 characters long").isLength({ min: 8 })
],(req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) =>{
        if (err){
            res.json({success: false, msg: 'Failed to register user'})
        } else {
            res.json({success: true, msg: 'User registered'});
        }
    })
});

/**
 * Authentication Route
 */
router.post('/authenticate', [
    check('email', "Invalid Email").isEmail(),
    check('password', "Password must be at least 8 characters long").isLength({ min: 8 })
],(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const email    = req.body.email;
    const password = req.body.password;

    User.getUserByEmail (email, (err, user) => {
        if (err) throw err;
        if (!user){
            return res.json({success: false, msg: 'User not found'})
        }

        //If User exists, check for password
        User.comparePassword(password, user.password, (err, isMatch) => { 
            if (err) throw err;
            if (isMatch){
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800 // 1 week
                });
                
            //Response to frontend
            res.json({
                success: true,
                token: 'JWT ' + token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email 
                }
            });
            } else {
                return res.json({success: false, msg: 'Wrong password'});
            }
        });
    });

});

/**
 * Profile Route
 */
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

router.post('/oauth/google', passport.authenticate('googleToken', {session:false}))
module.exports = router;
