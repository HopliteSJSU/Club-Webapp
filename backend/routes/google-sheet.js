/**
 * Module for scraping member information from Google Sheet into database
 */
const express         = require('express'),
      router          = express.Router(),
      {google}        = require('googleapis'),
      sheets          = google.sheets('v4'),
      Member          = require('../models/member');
 
const { SPREADSHEET_ID_2 } = require('../config/keys');
const { API_KEY }          = require('../config/keys');

/**
 * Retrieve Members' information from Google Sheets API and 
 * put into database
 */
router.get('/retrieve/memberinfo', function(req, res) { 
  authorize(function(authClient) {
    var request = {
      spreadsheetId: SPREADSHEET_ID_2,
      range: "Form Responses 1!B2:N98",
      valueRenderOption: 'FORMATTED_VALUE',
      majorDimension: 'ROWS',
      auth: authClient,
      key: API_KEY
    };

    sheets.spreadsheets.values.get(request, function(err, response) {
      if (err) {
        console.error('The API returned an error: ' + err);
        return;
      }
      const rows = response.data.values;
      var row = rows;
      if (rows.length != 0) {
        for (var i = 0; i < row.length; i++) {
          let newMember = new Member({
            name: row[i][1],
            email: row[i][0],
            major: row[i][7],
            expectedGraduation: row[i][9],
            majorCoursesTaken: row[i][10],
            githubURL: row[i][11],
            linkedInURL: row[i][12]
          });

          Member.addMember(newMember, (err, member) =>{
            if (err){
                res.json({success: false, msg: 'Failed to add member'})
            } else {
                res.json({success: true, msg: 'Member added to database'});
            }
          })
          }
        }
    });
  });
});

/**
 * Check authorization of request to the Google Sheets API for public data 
 * using API key.
 * @param {*} callback The callback for the authorized client.
 */
function authorize(callback) {
  var authClient = 'https://www.googleapis.com/auth/spreadsheets.readonly';

  if (authClient == null) {
    console.log('authentication failed');
    return;
  }
  callback(authClient);
};

module.exports = router;