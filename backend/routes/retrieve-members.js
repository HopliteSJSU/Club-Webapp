const express = require('express');
const Member = require('../models/member');
const router = express.Router();

router.get('/retrieve/members', (req, res) => {
  Member.find({}, (err, data) => {
    console.log('Retrieving members from database...');
    console.log(data);
    res.send(data);
  });
});

module.exports = router;
