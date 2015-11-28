import NameLoader from '../../src/client/app/src/view/NameLoader';
import { NameLoaderView } from '../../src/client/app/src/view/NameLoaderView';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-addons-test-utils';

import 'should';

describe('NameLoader', () => {
  let nameLoader : React.ReactElement<any>;

  before(() => {
    const shallowRenderer = TestUtils.createRenderer();

    shallowRenderer.render(
      <NameLoader staticName="static" />
    );

    nameLoader = shallowRenderer.getRenderOutput();
  });

  it('should exist', () => {
    nameLoader.should.be.ok;
  });

  it('should render a NameLoaderView', () => {
    nameLoader.type.should.be.equal(NameLoaderView);
  });

  it('should pass through the correct props', () => {
    nameLoader.props.staticName.should.be.equal('static');
    nameLoader.props.appName.should.be.equal('');
    nameLoader.props.handleClick.should.be.a.Function;
  });
});
