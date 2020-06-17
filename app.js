const express = require("express");
//const mongoose = require("mongoose");
const morgan = require("morgan"); // api logger as midleware
const checkFileRouter = require("./routes/checkFileRoute")
const app = express();

// requests funneled through morgan logger before going to the routers 
app.use(morgan("dev"))

// Allowing cross origin (adding to header)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.setHeader(
            "Access-Control-Allow-Methods",
            'GET'
        )
        return res.status(200).json({});
    }
    next();
});


//--- Serve Static Files
app.use(express.static('./public'))

//--- Different routes 
app.post('/checkFile', checkFileRouter)
    //---



// error Handling: catches all request that make it past app Routes
app.use((req, res, next) => {
    const error = new Error("Not Found !!");
    error.status = 404;
    next(error);
});
// catch other errors, if not specified give them 500 code
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;