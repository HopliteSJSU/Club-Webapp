const AWS = require('aws-sdk');
const express = require('express');
const keys = require('../config/keys');

const router = express.Router();

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

router.post('/api/update/files', (req, res) => {
    const fileName = req.body.file;
    const userID = req.body.userID;
    const fileType = getFileType(fileName);

    if (fileType) {
        s3.upload({
            Bucket: keys.bucket,
            Key: userID + '-' + fileType,
            Body: req,
            ACL: 'public-read'
        }, (err, data) => {
            if (err) throw err;
            else res.send(data);
            console.log('File successfully uploaded.');
        });
    } else {
        res.send('Unsupported file type. Please select either a .jpg or .png file for images and either a .pdf, .docx, or .doc file for resumes.');
    }
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
