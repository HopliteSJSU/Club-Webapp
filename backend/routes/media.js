const AWS = require('aws-sdk');
const express = require('express');
const keys = require('../config/keys');
var request = require('request');
const fs = require('fs');
const url = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='
const router = express.Router();
const multiparty = require('multiparty');

const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyAWS,
    secretAccessKey: keys.secretKeyAWS,
    region: keys.regionAWS
});

const supportedFileTypes = {
    picture: ['jpg', 'png'],
    resume: ['pdf', 'docx', 'doc']
};

const getFileType = (fileName) => {
    const fileExtension = fileName.split('.').pop();

    if (supportedFileTypes.picture.includes(fileExtension)) {
        return 'picture';
    } else if (supportedFileTypes.resume.includes(fileExtension)) {
        return 'resume';
    }

    return false;
};
// Protected route
router.post('/api/update/files', (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, async(err, fields, files)=> {
        console.log(fields)
        const path = files.file[0].path;
        const buffer = fs.readFileSync(path);
        console.log(typeof buffer)
       const fileName = path;
       // Retrieve access token from request
       const token = fields.token[0];
       // Validate token before uploading
       request.get(url+token, (err, resp, body)=>{
           // Verify email
           if(JSON.parse(body)["verified_email"]===true && JSON.parse(body).email.split("@").pop() === 'sjsu.edu'){
               const userID = body.email;
               const fileType = getFileType(fileName);
               if (fileType) {
                   s3.upload({
                       Bucket: keys.bucket,
                       Key: userID + '-' + fileType,
                       Body: buffer,
                       ACL: 'public-read'
                   }, (err, data) => {
                       if (err) throw err;
                       else res.send(data);
                       console.log('File successfully uploaded.');
                   });
               } else {
                   res.send('Unsupported file type. Please select either a .jpg or .png file for images and either a .pdf, .docx, or .doc file for resumes.');
               }
           }else{
               res.send('Invalid Token, Please Re-login')
           }
           
       })
    })
});

router.get('/api/files', (req, res) => {
    const key = req.query.key; // Send GET request with value of the form: userID-fileType where fileType can be either 'picture' or 'resume'

    s3.getObject({
        Bucket: keys.bucket,
        Key: key
    }, (err, data) => {
        if (err) throw err;
        else res.send(data);
        console.log('File successfully retrieved.');
    });
});

module.exports = router;
