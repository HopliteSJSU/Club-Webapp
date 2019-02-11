/**
 * Module for adding emails to the club's Google Sheets
 */
const router =   require('express').Router();
const fs =       require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// insert sheet to be updated here
const { SPREADSHEET_ID } = require('../config/keys');

const CALLBACK_URL = process.env.ENDPOINT_URL || "http://localhost:8080";

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Constants for spreadsheet positions
const THURSDAY = 4
const FRIDAY = 5

const TOTAL_CHECKIN_COL = 1
const THURSDAY_COL = 2
const FRIDAY_COL = 3

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
const authorize = (credentials, callback) => {
  const {client_secret, client_id } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, CALLBACK_URL + '/auth/google/callback'
      );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
const getNewToken = (oAuth2Client, callback) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * GET
 * Get unique session check in code
 */
router.get('/api/checkin/generate', async (req,res) => {
    try {
        let code = Math.random().toString(36).substring(7);     // 5 digit alphanumeric code for physical presence validation
        let expiresIn = Date.now() + 600000;   // expires in 10 minutes after code is created

        // write the code and expiry date to the google sheets
        await updatePhysicalCode(res,code,expiresIn);

    } catch(err) {
        return res.status(400).json({
            success: false,
            err,
        });
    }
});

/**
 * GET
 * Route returns a JSON file with the code needed to generate token.json
 * Use this route after validating the Google account that has access to read/write the desired Google Sheets
 * Please check if the sheets ID in config matches the desired sheets to be updated
 */
router.get('/auth/google/callback', (req,res) => {
  res.send({
    code: req.query.code
  });
});

/**
 * POST
 * Write/update members attendance, create new row if needed
 */
router.post('/api/checkin/update', (req,res) => {
  let { email, code } = req.body;
  let emailSplit = '';

  try {
    if (email !== undefined && email && email.length)
      emailSplit = email.split('@');
    else
      throw new Error('Check your email again');

    if (code === undefined || !code || !code.length || emailSplit.length !== 2 || emailSplit[1] !== 'sjsu.edu')
      throw new Error('Invalid form information sent to server, check if code is valid and email must be @sjsu.edu');
    else
      updateEmail(res,code,email);

  } catch(err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      err
    });
  }
});

/**
 * Function to update/upsert the check in count belonging to the argument's email
 * @param {Object} res The response object passed in from express
 * @param {String} code The physical validation code
 * @param {String} email The email to increase the check in count for
 */
const updateEmail = (res,code,email) => {
  fs.readFile('./config/credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), auth => {
      const sheets = google.sheets({version: 'v4', auth});

      sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'A2:B2',
        auth,
      }, (err, codeResponse) => {
        if (err) {
          console.log(err);
        } else {
          // 0th index of codeArr contains the physical validation code
          // 1st index of codeArr contains the expiryDate in epoch millisecs
          let codeArr = codeResponse.data.values[0];
          let numDays = 0;

          if (code === codeArr[0] && Date.now() < Number(codeArr[1])) {
            sheets.spreadsheets.values.get({
              spreadsheetId: SPREADSHEET_ID,
              range: 'A5:G',
              auth,
            }, (err, memberResponse) => {
              if (err) {
                console.log(err);
              } else {
                let membersArr = memberResponse.data.values;

                if (membersArr !== undefined && membersArr) {
                  let date = new Date();
                  var dayOfWeek = date.getDay();
                  let emailExists = false;

                  try {
                    membersArr.forEach((v,i) => {
                      if (String(v[0]).split('\'').join('') === email.trim()) {
                        emailExists = true;

                        if (dayOfWeek === THURSDAY && (Date.now() > Number(membersArr[i][dayOfWeek]) + 518300000 || membersArr[i][dayOfWeek] === 'N/A')) {
                          membersArr[i][TOTAL_CHECKIN_COL] = Number(membersArr[i][1]) + 1;
                          membersArr[i][THURSDAY_COL] = Number(membersArr[i][THURSDAY_COL]) + 1;
                          membersArr[i][4] = Date.now();
                          membersArr[i][6] = date.toLocaleDateString();
                        } else if (dayOfWeek === FRIDAY && Date.now() > (Number(membersArr[i][dayOfWeek]) + 518300000) || membersArr[i][dayOfWeek] === 'N/A') {
                          membersArr[i][TOTAL_CHECKIN_COL] = Number(membersArr[i][1]) + 1;
                          membersArr[i][FRIDAY_COL] = Number(membersArr[i][FRIDAY_COL]) + 1;
                          membersArr[i][5] = Date.now();
                          membersArr[i][6] = date.toLocaleDateString();
                        } else {
                          if (dayOfWeek < 4)
                            numDays = 4 - dayOfWeek;
                          else if (dayOfWeek >= 5)
                            numDays = 6 - dayOfWeek + 5
                          else if (dayOfWeek === 4)
                            numDays = 1

                          throw new Error();
                        }
                      }
                    });
                  } catch(err) {
                    return res.status(400).json({
                      success: false,
                      msg: `You are checking in more than once on the same day, or checking in when club meeting is not in session, try again in ${ numDays === 0 ? 'a few hours' : `${ numDays } day(s)`}`,
                    });
                  }

                  // if email doesn't already exist, but there are entries present inside the sheets append it to the membersArr
                  if (!emailExists) {
                    if (dayOfWeek === THURSDAY || dayOfWeek === FRIDAY) {
                      membersArr.push([ email.trim(), 1, 0, 0, 'N/A', 'N/A', date.toLocaleDateString() ]);

                      if (dayOfWeek === THURSDAY)
                        membersArr[membersArr.length - 1][THURSDAY_COL] = 1;
                      else if (dayOfWeek === FRIDAY)
                        membersArr[membersArr.length - 1][FRIDAY_COL] = 1;

                      membersArr[membersArr.length - 1][dayOfWeek] = Date.now();
                    } else {
                      return res.status(400).json({
                        success: false,
                        msg: 'Today is not a day to check in! Please try again on Thursday or Friday'
                      });
                    }
                  }
                } else {
                  membersArr = [];
                  let date = new Date();
                  let dayOfWeek = date.getDay();

                  if (dayOfWeek === THURSDAY || dayOfWeek === FRIDAY) {
                    membersArr.push([ email.trim(), 1, 0, 0, 'N/A', 'N/A', new Date().toLocaleDateString() ]);

                    if (dayOfWeek === THURSDAY)
                      membersArr[0][THURSDAY_COL] = 1;
                    else if (dayOfWeek === FRIDAY)
                      membersArr[0][FRIDAY_COL] = 1;

                    membersArr[0][dayOfWeek] = Date.now();
                  } else {
                    return res.status(400).json({
                      success: false,
                      msg: 'Today is not a day to check in! Please try again on Thursday or Friday'
                    });
                  }
                }

                let values = membersArr;

                const resource = {
                  values
                };

                sheets.spreadsheets.values.update({
                  spreadsheetId: SPREADSHEET_ID,
                  range: 'A5:G',
                  valueInputOption: 'USER_ENTERED',
                  auth,
                  resource
                }, (err, result) => {
                  if (err) {
                    throw new Error(err);
                  } else {
                    return res.status(200).json({
                      success: true,
                      msg: "Successfully updated/upserted member's check in count in Google Sheets",
                    });
                  }
                });
              }
            });

          } else {
            return res.status(403).json({
              success: false,
              msg: 'Check your code and the code\'s expiration date again, currently unauthorized to sign in'
            });
          }
        }
      });
    });
  });
}



/**
 * Function to paste the newly generated code onto the club's sheet
 * @param {Object} auth is the object returned from the authorize function, where the return value is OAuth2Client
 */
const updatePhysicalCode = async (res,code,expiresIn) => {
  fs.readFile('./config/credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), auth => {
      const sheets = google.sheets({version: 'v4', auth});
      let values = [
        [
          code, expiresIn
        ],
      ];

      const resource = {
        values
      };

      sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'A2:B2',
        valueInputOption: 'RAW',
        auth,
        resource
      }, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          return res.status(200).json({
            success: true,
            msg: "Successfully updated the generated code in Google Sheets",
            code, expiresIn
          });
        }
      });
    });
  });
}

module.exports = router;
