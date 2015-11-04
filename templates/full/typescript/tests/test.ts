import * as request from 'superagent';
import * as should from 'should';
import * as http from 'http';

var server : http.Server;

describe('Server ', () => {
  before(() => {
    server = require('../build/server');
  });
  
  after(() => {
    server.close();
  });

  it('should be listening', (done) => {
    request.get(getServerUrl(server))
      .end((error, result) => {
        result.should.not.equal(undefined);
        done(error);
      });
  });

  it('should return the appname', (done) => {
    request.get(getServerUrl(server) + '/api')
      .end((error, result) => {
        should(result.text === '<%= appname %>').ok;
        done(error);
      });
  })
});

function getServerUrl(server) {
  var sAddress = server.address();
  if (sAddress.address.indexOf('::') != -1 ||
    sAddress.address.indexOf('0.0.0.0') != -1) {
    sAddress.address = 'localhost'
  }

  return sAddress.address + ':' + sAddress.port;
}