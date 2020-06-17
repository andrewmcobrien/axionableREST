var path = require('path')

const app = require('../app')

exports.checkFile = async(req, res, next) => {
    try {
        console.log('the beginning of the POST REQUEST !')
        res.status(200).json({ message: `${req.body.fileToUpload} succesfully uploaded` });

        // here we could put the logic for checking the file extension !!
        console.log(req.body.fileToUpload)



        // if we want to catch an error for wrong file extension
    } catch (err) {
        if (err.message == '') {
            console.error(err);
            res.status(400).json({ message: "" });
        } else {
            console.error(err);
            res.status(404).json({ message: "" });
        }
    }
}