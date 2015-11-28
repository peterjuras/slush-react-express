import React, { Component } from 'react';
import NameLoaderView from './NameLoaderView';

// React component that handles the button click
export default class NameLoader extends Component {
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
