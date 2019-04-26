/**
 * Module for adding Recruiter's profile to database
 */
const mongoose = require('mongoose'),
      bcrypt   = require('bcryptjs'),
      config   = require('../config/database'); 

//User Schema

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../config/database';

const RecruiterSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const Recruiter = module.exports = mongoose.model ('Recruiter', RecruiterSchema, 'recruiter');

/**
 * Get Recruiter by ID
 */
module.exports.getRecruiterByID = function(id, callback){
    Recruiter.findById(id, callback);
}
/**
 * Get Recruiter by Email
 */
module.exports.getRecruiterByEmail = function(email, callback){
    const query = {email: email}
    Recruiter.findOne(query, callback);
}
/**
 * Add new Recruiter with encrypted password
 */
module.exports.addRecruiter = function(newRecruiter, callback){
    console.log("name: " + newRecruiter.name);
    console.log("email: " + newRecruiter.email);
    console.log("pass: " + newRecruiter.password);
    
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newRecruiter.password, salt, (err, hash) => {
            if (err) throw err;
            newRecruiter.password = hash;
            newRecruiter.save(callback);
        });
    });
}

/**
 * Check if the password match with password in db
 * @param candidatePassword Password to be compared 
 * @param hash Password to be compared to
 * @param callback Callback receiving the error, if any, otherwise the result
 */
module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}

const Recruiter = mongoose.model('Recruiter', RecruiterSchema);

Recruiter.getRecruiterByName = (name, callback) => {
    const query = { name: name };
    Recruiter.findOne(query, callback);
}

Recruiter.getRecruiterByEmail = (email, callback) => {
    const query = { email: email };
    Recruiter.findOne(query, callback);
}

Recruiter.addRecruiter = (newRecruiter, callback) => {
    bcrypt.hash(newRecruiter.password, 10, (err, hash) => {
        if (err) throw err;
        newRecruiter.password = hash;
        newRecruiter.save(callback);
    });
}

