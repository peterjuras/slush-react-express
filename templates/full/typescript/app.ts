import express = require('express');
import path = require('path');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import favicon = require('serve-favicon');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(favicon(`${__dirname}/public/favicon.ico`));
app.use(express.static(path.join(__dirname, 'public')));

// Routes go here
var index = require('./routes/index');

app.use('/api', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err : any = new Error('Not Found');
  err.status = 404;
  next(err);
});

export = app;