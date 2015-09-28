var server;
var request = require('superagent');
var should = require('should');

describe('Server ', function () {
   before(function() {
     server = require('../build/server');
   });

   it('should be listening', function (done) {
     request.get(getServerUrl(server))
      .end(function (error, result) {
        result.should.not.equal(undefined);
        done(error);
      });
   });

   it('should return the appname', function (done) {
     request.get(getServerUrl(server) + '/api')
      .end(function (error, result) {
        should(result.text.indexOf('<%= appname %>') != -1).ok;
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