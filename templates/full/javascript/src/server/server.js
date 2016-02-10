'use strict';

const app = require('./app');
const path = require('path');
const http = require('http');

function normalizePort(val) {
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

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);
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

module.exports = {
  port: port,
  server: server
};
