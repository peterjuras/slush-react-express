import * as React from 'react';

export class SharedProps {
  staticName: string;
}

class NameLoaderProps extends SharedProps {
  handleClick: () => void;
  appName: string;
}

// View that displays a button to call the server
export class NameLoaderView extends React.Component<NameLoaderProps, {}> {
  render() {
    return (
      <div>
        <h1>{this.props.staticName}</h1>
        <p>Hello {this.props.staticName}</p>
        <input type="button" value="Get app name" onClick={this.props.handleClick} />
        <p>{this.props.appName}</p>
      </div>
    );
  }
}
