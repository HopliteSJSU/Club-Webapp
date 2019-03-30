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
    image: ['jpg', 'png'],
    resume: ['pdf', 'docx', 'doc']
};

const checkFileType = (fileName) => {
    const fileType = fileName.split('.').pop();
    return (supportedFileTypes.image.includes(fileType) || supportedFileTypes.resume.includes(fileType));
};

router.post('/api/update/files', (req, res) => {
    const fileName = req.body.file;
    const userID = req.body.userID;

    if (checkFileType(fileName)) {
        s3.upload({
            Bucket: keys.bucket,
            Key: userID + '-' + fileName,
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
    const key = req.query.key; // Send GET request with value of the form: userID-fileName

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
