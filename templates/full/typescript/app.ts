import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import favicon = require('serve-favicon');
import cookieParser = require('cookie-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(favicon(`${__dirname}/public/favicon.ico`));
app.use(express.static(path.join(__dirname, 'public')));

// Routes go here
// Sample route that returns the app name
import * as index from './routes/index';
app.use('/api', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

export = app;