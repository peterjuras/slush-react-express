import NameLoaderView from '../../src/client/app/view/NameLoaderView';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Wrapper from './util/Wrapper';

import 'should';

describe('NameLoaderView', () => {
  let nameLoaderView;
  const onClickFunction = function onClick() { }

  before(() => {
    const shallowRenderer = TestUtils.createRenderer();

    // Stateless components have issues when using a shallow rendering, therefore
    // we have to wrap it in a stateful React component
    shallowRenderer.render(
      <Wrapper><NameLoaderView staticName="static" appName="app" handleClick={onClickFunction} /></Wrapper>
    );

    nameLoaderView = shallowRenderer.getRenderOutput().props.children;
  });

  it('should exist', () => {
    nameLoaderView.should.be.ok;
  });

  it('should be a NameLoaderView', () => {
    nameLoaderView.type.should.be.equal(NameLoaderView);
  });

  it('should have the correct props', () => {
    nameLoaderView.props.staticName.should.be.equal('static');
    nameLoaderView.props.appName.should.be.equal('app');
    nameLoaderView.props.handleClick.should.be.equal(onClickFunction);
  });
});
