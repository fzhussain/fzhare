const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid', async (req, res) => {

    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        console.log(file)

        if (!file) {
            return res.render('download', { error: 'Link has been expired.' });
        }

        // If file is found
        return res.render('download', {
            uuid: file.uuid,
            fileName: file.filename,
            fileSize: file.size,
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
        });
    } catch (err) {
        return res.render('download', { error: 'Something went wrong!' });  // will search in views folder for the file named 'download'
    }


});  // : - dynamic parameter

module.exports = router;

/*
NOTES ->
1. findOne() - finds one row from the database

*/