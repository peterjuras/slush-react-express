'use strict';

import app from './app';
import * as path from 'path';
import * as http from 'http';

function normalizePort(val : string) : (string | Number | boolean) {
  const portNorm = parseInt(val, 10);

  if (isNaN(portNorm)) {
    // named pipe
    return val;
  }

  if (portNorm >= 0) {
    // port number
    return portNorm;
  }

  return false;
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}

export const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

export const server = http.createServer(app);
server.listen(port);
server.on('listening', onListening);

if (process.env['gulp:watch']) {
  require('chokidar-socket-emitter')({
    path: 'src/client/app',
    app: server,
    dir: path.join(__dirname, '..', '..'),
    relativeTo: 'src/client/app/',
  });
}
