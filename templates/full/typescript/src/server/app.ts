import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as morgan from 'morgan';
import * as expressReact from 'express-react-views';
import ErrorMessage from './lib/error-message';

const app = express();
if (app.get('env') !== 'production' && app.get('env') !== 'test') {
    app.use(morgan('dev'));
}
app.use(favicon(path.join(__dirname, '/../client/static/favicon.ico')));
app.use(express.static(path.join(__dirname, '/../client/static')));
app.use(express.static(path.join(__dirname, '/../client/app')));

// Use React for server side view rendering
app.set('views', __dirname + '/view');
app.set('view engine', 'tsx');
app.engine('tsx', expressReact.createEngine({ transformViews: false }));

// Routes go here
// Sample route that returns the app name
import index from './route/index';
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

app.use((err: any, req: express.Request, res: express.Response, next: Function) => {
  let error : ErrorMessage;
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

export default app;
