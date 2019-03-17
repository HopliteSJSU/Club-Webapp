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

export default Recruiter;
