const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const expressReact = require('express-react-views');
const ErrorMessage = require('./lib/error-message');

const app = express();
if (app.get('env') !== 'production' && app.get('env') !== 'test') {
    app.use(morgan('dev'));
}
app.use(favicon(path.join(__dirname, '/../client/static/favicon.ico')));
app.use(express.static(path.join(__dirname, '/../client/static')));
app.use(express.static(path.join(__dirname, '/../client/app')));

// Use React for server side view rendering
app.set('views', __dirname + '/view');
app.set('view engine', 'jsx');
app.engine('jsx', expressReact.createEngine());

// Routes go here
// Sample route that returns the app name
const index = require('./route/index').router;
app.use('/api', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new ErrorMessage({
    title: 'Not Found',
    status: 404,
    message: 'The requested resource could not be found.',
    stack: new Error().stack
  });
  next(error);
});

app.use((err, req, res, next) => {
  let error;
  if (err instanceof ErrorMessage) {
    error = err;
  } else {
    error = new ErrorMessage({
      title: err.name || 'Internal Server Error',
      status: err.status || 500,
      message: 'Something went wrong',
      stack: err.stack || new Error().stack
    });
  }

  res.render('error', error);
});

module.exports = app;
