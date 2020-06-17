var path = require('path')

const app = require('../app')

exports.checkFile = async(req, res, next) => {
    try {
        console.log('the beginning of the POST REQUEST !')
        res.status(200).json({ message: `succesfully uploaded - soon to come get requests to access pictures from DATABASE!` });

        console.log(req.fileToUpload)

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