/**
 * Module for adding Recruiter profile to database
 */
const mongoose = require('mongoose'),
      bcrypt   = require('bcryptjs'),
      config   = require('../config/database'); 

//User Schema
const UserSchema = mongoose.Schema({
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

const User = module.exports = mongoose.model ('User', UserSchema);

/**
 * Get user by ID
 */
module.exports.getUserByID = function(id, callback){
    User.findById(id, callback);
}
/**
 * Get User by Email
 */
module.exports.getUserByEmail = function(email, callback){
    const query = {email: email}
    User.findOne(query, callback);
}
/**
 * Add new User with encrypted password
 */
module.exports.addUser = function(newUser, callback){
    console.log("name: " + newUser.name);
    console.log("email: " + newUser.email);
    console.log("pass: " + newUser.password);
    
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
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

//Check for existed user before registering
