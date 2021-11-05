const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid', async (req, res) => {
    // Extract link and get file from storage send download stream 
    console.log("Inside download.js")
    const file = await File.findOne({ uuid: req.params.uuid });
    console.log(file)
    // Link expired
    if (!file) {
        return res.render('download', { error: 'Link has been expired.' });
    }
    const filePath = `${__dirname}/../${file.path}`;  // file.path = uploads/1634567435203-556166486.PNG
    console.log(filePath);
    res.download(filePath);
});


module.exports = router;