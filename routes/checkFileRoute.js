const express = require('express');
const checkFileRouter = express.Router();

const checkFileController = require('../controllers/checkFileController.js');

//Express middleware to handle web scraping GET requests 
checkFileRouter.post('/checkFile', checkFileController.checkFile);

module.exports = checkFileRouter;