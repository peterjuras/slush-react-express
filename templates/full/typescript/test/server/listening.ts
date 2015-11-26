import * as request from 'superagent';
import { getServerUrl } from './util/address';
import { port, server } from '../../src/server/server';

import 'should';

describe('Server', () => {

  before(() => {
    if (!getServerUrl(server)) {
      server.listen(port);
    }
  });

  after(() => server.close());

  it('should be listening', done => {
    request.get(getServerUrl(server))
      .end((error : any, result : request.Response) => {
        result.should.be.ok;
        done(error);
      });
  });
});
