/**
 * Module for scraping member information from Google Sheet into database
 */
const express         = require('express'),
      router          = express.Router(),
      {google}        = require('googleapis'),
      sheets          = google.sheets('v4'),
      Member          = require('../models/member'),
      SPREADSHEET_ID  = '1Wq5tih_d-AM1dTFGfTYxUGNJqg9COvzbeC5c7CB-n-c';
      
/**
 * Retrieve Members' information from Google Sheets API and 
 * put into database
 */
router.get('/retrieve/memberinfo', function(req, res) { 
  authorize(function(authClient) {
    var request = {
      spreadsheetId: SPREADSHEET_ID,
      range: "Form Responses 1!B2:N98",
      valueRenderOption: 'FORMATTED_VALUE',
      majorDimension: 'ROWS',
      auth: authClient,
      key: 'AIzaSyAv2iy_RogTqo8mHcgZV4cdOwq51vClekg' //API key
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