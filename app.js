const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const morgan = require("morgan"); // api logger as midleware
const checkFileRouter = require("./routes/checkFileRoute")
const bodyParser = require('body-parser')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const methodOverride = require('method-override')

const app = express();

// middleware
app.use(morgan("dev"))
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

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
    gfs.collection('checkFile')
    console.log("GFS set");
});


// Create storage engine
const storage = new GridFsStorage({
    db: db,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'checkFile'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });



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


// Serve the views with EJS 
app.get('/', (req, res) => {
    res.render('index');
});

//--- Different routes 
app.post('/checkFile', upload.single('fileToUpload'), checkFileRouter)
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