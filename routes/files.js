const path = require('path');
const router = require('express').Router();

const File = require('../models/file');

const multer = require('multer');
var uuid = require('uuid');

let storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, 'uploads/')
    },
    filename: (request, file, callback) => {
        // File name genetated must be unique
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        callback(null, uniqueName);  // first argument is error which is null in our case
        // 1E9 - 1 billion
    }
});

let upload = multer({
    // storage: storage,
    storage,
    limit: { filesize: 1000000 * 100 }  // 100mb
}).single('myfile');  // single file upload | myfile -> must be same as used in insomnia

router.post('/', (req, res) => {

    // Upload files
    upload(req, res, async (err) => {
        // Validate request
        if (!req.file) {
            return res.json({ error: 'All fields are required!' });
        }
        if (err) {
            return res.status(500).send({ error: err.message })
        }
        // If no error then -> Store into database
        const file = new File({
            filename: req.file.filename,
            uuid: uuid.v4(),
            path: req.file.path,
            size: req.file.size,
        });
        const response = await file.save();
        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` })

    })
    // Response - Link of file download
});

router.post('/send', async (req, res) => {

    // console.log(req.body)
    // return res.send({});
    const { uuid, emailTo, emailFrom } = req.body;
    // Validate the request
    if (!uuid || !emailTo || !emailFrom) {
        res.status(422).send({ error: 'All fields are required!' });
    }

    // If all fields are entered by the user -> Get data from the user
    const file = await File.findOne({ uuid: uuid });
    if (file.sender) {
        res.status(422).send({ error: 'Email already sent!' });
    }
    file.sender = emailFrom;
    file.receiver = emailTo;

    const response = await file.save();

    // Send Email
    const sendMail = require('../services/emailService');
    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: "FZHare File Sharing",
        text: `${emailFrom} shared a file!`,
        // html: '<h1>Hello from FZHare</h1>'
        html: require('../services/emailTemplate')({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: `${parseInt(file.size / 1000)} KB`,
            expires: '24 hours'
        })  // function call
    });
    return res.send({ success: true });

});

module.exports = router;


/*
Notes ->
1. router.post('/test') -> /api/files/test
2. Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.
3. Date.now() -> A Number representing the milliseconds elapsed since the UNIX epoch.
4. The HTTP status code 500 is a generic error response. It means that the server encountered an unexpected condition that prevented it from fulfilling the request. This error is usually returned by the server when no other error code is suitable.
5. 422 Unprocessable Entity response status code indicates that the server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.

*/