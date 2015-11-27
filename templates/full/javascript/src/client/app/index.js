import React, { Component } from 'react';
import { render } from 'react-dom';
import NameLoaderView from './view/NameLoaderView';

import './style/index.<%= styleExt %>!';

// React component that handles the button click
class NameLoader extends Component {
  constructor(...props) {
    super(...props);

    this.state = { appName: '' };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    fetch('/api')
      .then(response => response.text())
      .then(text => this.setState({ appName: text }));
  }

  render() {
    return <NameLoaderView appName={this.state.appName} staticName={this.props.staticName} handleClick={this.handleClick} />;
  }
}

// Tell react to render the component
render(<NameLoader staticName="<%= appname %>" />, document.getElementById('content'));
