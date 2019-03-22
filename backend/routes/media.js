import AWS from 'aws-sdk';
import express from 'express';
import keys from '../config/keys';

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

    if (checkFileType(fileName)) {
        s3.upload({
            Bucket: keys.bucket,
            Key: fileName,
            Body: req,
            ACL: 'public-read'
        }, (err, data) => {
            if (err) throw err;
            else res.send(data);
            console.log('File successfully uploaded.');
        });
    } else {
        res.send('Unsupported file type. Please upload either a .jpg or .png file for images and either a .pdf, .docx, or .doc file for resumes.');
    }
});

router.get('/api/files', (req, res) => {
    const fileName = req.query.file;

    if (checkFileType(fileName)) {
        s3.getObject({
            Bucket: keys.bucket,
            Key: fileName
        }, (err, data) => {
            if (err) throw err;
            else res.send(data);
            console.log('File successfully retrieved.');
        });
    } else {
        res.send('Unsupported file type. Please upload either a .jpg or .png file for images and either a .pdf, .docx, or .doc file for resumes.');
    }
});

export default router;
