import * as React from 'react';
import { NameLoaderView, SharedProps } from './NameLoaderView';

// React component that handles the button click
export default class NameLoader extends React.Component<SharedProps, { appName: string }> {
  constructor(props: SharedProps) {
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
