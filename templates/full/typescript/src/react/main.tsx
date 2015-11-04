import * as React from 'react';
import {NameLoaderView, NameLoaderProps} from './views/NameLoaderView';
var ReactDOM: __ReactDom = require('react-dom');

class NameLoaderState {
  public appName: string;
}

// React component that handles the button click
class NameLoader extends React.Component<NameLoaderProps, NameLoaderState> {
  constructor(props: NameLoaderProps) {
    super(props);
    this.state = {
      appName: ''
    };
  }
  handleClick = () => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api', true);
    xhr.onload = () => {
      this.setState({ appName: xhr.responseText });
    }
    xhr.send();
  }
  render() {
    return <NameLoaderView staticName={this.props.staticName} appName={this.state.appName} handleClick={this.handleClick} />;
  }
}

// Tell react to render the component
ReactDOM.render(<NameLoader staticName="<%= appname %>" />, document.getElementById('content'));