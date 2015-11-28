import * as React from 'react';
import { render } from 'react-dom';
import { NameLoaderView, SharedProps } from './view/NameLoaderView';

import '../style/index.<%= styleExt %>!';

// React component that handles the button click
class NameLoader extends React.Component<SharedProps, { appName: string }> {
  constructor(props : SharedProps) {
    super(props);

    this.state = { appName: '' };
  }

  handleClick = () => {
    fetch('/api')
      .then(response => response.text())
      .then(text => this.setState({
        appName: text
      }));
  }

  render() {
    return <NameLoaderView appName={this.state.appName} staticName={this.props.staticName} handleClick={this.handleClick} />;
  }
}

// Tell react to render the component
render(<NameLoader staticName="<%= appname %>" />, document.getElementById('content'));
