import NameLoader from '../../src/client/app/view/NameLoader';
import NameLoaderView from '../../src/client/app/view/NameLoaderView';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import 'should';

describe('NameLoader', () => {
  let nameLoader;

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
