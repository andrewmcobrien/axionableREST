var path = require('path')

exports.checkFile = async(req, res, next) => {


    try {
        console.log('the beginning of the POST REQUEST !')
            // here we would put the logic for checking the file extension !!

        console.log(req)



        // just in case we want to catch error in the future 
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