const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan"); // api logger as midleware
const checkFileRouter = require("./routes/checkFileRoute")
const bodyParser = require('body-parser')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const methodOverride = require('method-override')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// requests funneled through morgan logger before going to the routers 
app.use(morgan("dev"))


// mongoDB connection - so we can track/store the images (limited db capacity)
let gfs;
mongoose.connect(process.env.DB_URL_WITHOUT_USER_PASS, {
    auth: {
        user: process.env.MONGOUSR,
        password: process.env.MONGOPSSWD
    },
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("connected to mongo")
    gfs = Grid(db, mongoose.mongo);
    gfs.collection('uploads')
    console.log("GFS set");
});







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


// Serve the views with EJS  - set basic view engine
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index');
});

//--- Different routes 
app.post('/checkFile', checkFileRouter)
    //---



// error Handling: catches all request that make it past app Routes
app.use((req, res, next) => {
    const error = new Error("Not Found");
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