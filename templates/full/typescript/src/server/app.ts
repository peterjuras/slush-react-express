import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as morgan from 'morgan';

const app = express();
if (app.get('env') !== 'production' && app.get('env') !== 'test') {
    app.use(morgan('dev'));
}
app.use(favicon(path.join(__dirname, '/../client/static/favicon.ico')));
app.use(express.static(path.join(__dirname, '/../client/static')));
app.use(express.static(path.join(__dirname, '/../client/app')));

// Routes go here
// Sample route that returns the app name
import index from './route/index';
app.use('/api', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err : any = new Error('Not Found');
  err.status = 404;
  next(err);
});

export default app;
