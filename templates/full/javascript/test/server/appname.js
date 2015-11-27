'use strict';

const request = require('superagent');
const getServerUrl = require('./util/address');
const serverModule = require('../../src/server/server');
const server = serverModule.server;
const port = serverModule.port;
const appname = require('../../src/server/route/index').appname;

require('should');

describe('Server ', () => {

  before(() => {
    if (!getServerUrl(server)) {
      server.listen(port);
    }
  });

  after(() => server.close());

  it('should return the appname', done => {
    request.get(getServerUrl(server) + '/api')
      .end((error, result) => {
        result.text.should.be.equal(appname);
        done(error);
      });
  });
});
