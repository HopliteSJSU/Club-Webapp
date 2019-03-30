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

const isValidFileType = (fileName) => {
    const fileType = fileName.split('.').pop();
    return (supportedFileTypes.picture.includes(fileType) || supportedFileTypes.resume.includes(fileType));
};

const getFileType = (fileName) => {
    const fileType = fileName.split('.').pop();

    if (supportedFileTypes.picture.includes(fileType)) {
        return 'picture';
    } else if (supportedFileTypes.resume.includes(fileType)) {
        return 'resume';
    }
};

router.post('/api/update/files', (req, res) => {
    const fileName = req.body.file;
    const userID = req.body.userID;

    if (isValidFileType(fileName)) {
        const fileType = getFileType(fileName);
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
