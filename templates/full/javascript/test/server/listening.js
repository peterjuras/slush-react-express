'use strict';

const request = require('superagent');
const getServerUrl = require('./util/address');
const serverModule = require('../../src/server/server');
const server = serverModule.server;
const port = serverModule.port;

require('should');

describe('Server', () => {

  before(() => {
    if (!getServerUrl(server)) {
      server.listen(port);
    }
  });

  after(() => server.close());

  it('should be listening', done => {
    request.get(getServerUrl(server))
      .end((error, result) => {
        result.should.be.ok;
        done(error);
      });
  });
});
