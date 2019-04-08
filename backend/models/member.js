/**
 * Module for adding Member's profile to database
 */
const mongoose = require('mongoose');

const MemberSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    major: {
        type: String,
        required: true
    },
    expectedGraduation: {
        type: String,
        required: true
    },
    majorCoursesTaken: {
        type: String,
        required: false
    },
    githubURL: {
        type: String,
        required: false
    },
    linkedInURL: {
        type: String,
        required: false
    }
})

const Member = module.exports = mongoose.model ('Member', MemberSchema, 'member');

/**
 * Add member to database
 */
module.exports.addMember = function(newMember, callback){
    newMember.save(function (err, member) {
        if (err) return console.error(err);
        // console.log(member.name + " saved to member collection.");
      });
}

/**
 * Get Member by ID
 */
module.exports.getMemberByID = function(id, callback){
    User.findById(id, callback);
}
/**
 * Get Member by Email
 */
module.exports.getMemberByEmail = function(email, callback){
    const query = {email: email}
    User.findOne(query, callback);
}