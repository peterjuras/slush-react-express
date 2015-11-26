const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');

const app = express();
if (app.get('env') !== 'production' && app.get('env') !== 'test') {
    app.use(morgan('dev'));
}
app.use(favicon(path.join(__dirname, '/../client/static/favicon.ico')));
app.use(express.static(path.join(__dirname, '/../client/static')));
app.use(express.static(path.join(__dirname, '/../client/app')));

// Routes go here
// Sample route that returns the app name
const index = require('./route/index').router;
app.use('/api', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
