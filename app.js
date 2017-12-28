const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

//init app
var app = express();

//storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//check file type
function checkFileType(file, callback) {
    const filetypes = /jpeg|jpg|png|gif/; //RegExp
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); //checking extension
    const mimetype = filetypes.test(file.mimetype); //checking mimetype
    if (mimetype && extname) {
        return callback(null, true);
    } else {
        return callback('Error : Images Only');
    }
}

//initialize upload variable
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 4194304
        //        fileSize: 414
    },
    fileFilter: function (req, file, callback) {
        checkFileType(file, callback);
    }
}).single('myfile');

//public
app.use(express.static('./public'));

//ejs
app.set('view engine', 'ejs');

//
app.get('/', function (req, res) {
    res.render('index');
});
app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.render('index', {
                msg: err
            });
        } else {
            //            console.log(req.file);
            if (req.file == undefined) {
                res.render('index', {
                    msg: 'No file selected'
                });
            } else {
                res.render('index', {
                    msg: 'Upload Success',
                    file: `uploads/${req.file.filename}`
                });
            }
        }
    });
});

const port = 3000;
app.listen(port, function () {
    console.log(`server started on ${port}`);
});
