import * as request from 'superagent';
import { getServerUrl } from './util/address';
import { port, server } from '../../src/server/server';
import { appname } from '../../src/server/route/index';

import 'should';

describe('API', () => {

  before(() => {
    if (!getServerUrl(server)) {
      server.listen(port);
    }
  });

  after(() => server.close());

  it('should return the appname', done => {
    request.get(getServerUrl(server) + '/api')
      .end((error : any, result : request.Response) => {
        result.text.should.be.equal(appname);
        done(error);
      });
  });
});
