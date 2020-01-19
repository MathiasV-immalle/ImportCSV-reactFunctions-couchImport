var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var app = express()
var couchimport = require('couchimport');
const request = require('request');

app.use(cors())
const fileUpload = require('express-fileupload');

// default options
app.use(fileUpload());

app.post('/upload', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.input;

  // Use the mv() method to place the file somewhere on your server

  sampleFile.mv('./input.txt', function(err) {
    if (err)
      return res.status(500).send(err);
      request({
        uri: `http://localhost:5984/${req.body.dbnaam}`,
        method: 'PUT'})
      var opts = { delimiter: "	", url: "http://localhost:5984", database: req.body.dbnaam };
      couchimport.importFile("./input.txt", opts, function(err,data) {
        console.log("done");
        console.log(req.body)
     });
    res.send('File uploaded!');
  });
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
