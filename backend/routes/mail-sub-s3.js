/**
 * Module dependencies.
 */
let AWS     = require("aws-sdk"),
  express = require('express'),
  keys    = require("../config/keys"),
  router  = express.Router();

/**
 * S3 Bucket Config
 * @type {S3}
 */
let s3 = new AWS.S3({
  accessKeyId: keys.accessKeyAWS,
  secretAccessKey: keys.secretKeyAWS,
  region: keys.regionAWS
});

/**
 * GET/
 * Home Page
 */
router.get("/", (req, res) => {
  res.status(200)
  .json({
    data: "This is the hompage of HopLite"
  });
});

/**
 * POST/
 * Update new Subscribers into the file on S3 Bucket
 */
router.post("/api/update/:email", (req, res) => {
  let email       = req.params.email;
  let fileNameTxt = 'subscribers.txt';
  let fileNameCSV = 'subscribers.csv';

  s3.getObject({            // Pull File and add new email to the file
    Bucket: keys.bucket,
    Key: fileNameTxt,
  }, (err, data) => {
    let array = data.Body.toString('utf-8').split('\n') ;
    let isFound = false;
    for (let i = 0; i < array.length; i++) {
      if (array[i] === email) {
        isFound = true;
        console.log("Repeated email. DOn't add to the file");
        break;
      }
    }
    if (!isFound) {
      let body = data.Body.toString('utf-8') + "\n" + email;
      writeNewFileToS3(fileNameTxt, fileNameCSV, body);
      return res.status(200).json({
        status: "success updated",
        getData: "/api/emails"
      })
    }
  });
});

/**
 * GET/
 * JSON file of all emails
 */
router.get('/api/emails', (req, res) => {
  let fileNameTxt = 'subscribers.txt';
  s3.getObject({            // Pull File and add new email to the file
    Bucket: keys.bucket,
    Key: fileNameTxt,
  }, (err, data) => {
    return res.status(200).json({
      data: data.Body.toString('utf-8')
    });
  });
});

/**
 * Send the new file to AWS S3 Bucket
 * @param fileNameTxt
 * @param fileNameCSV
 * @param data
 */
function writeNewFileToS3(fileNameTxt, fileNameCSV, data) {
  s3.upload({
    Bucket: keys.bucket,
    Key: fileNameTxt,
    Body: data,
    ACL: 'public-read',
  }, () => {});

  s3.upload({
    Bucket: keys.bucket,
    Key: fileNameCSV,
    Body: data,
    ACL: 'public-read',
  }, () => {});
}

module.exports = router;
