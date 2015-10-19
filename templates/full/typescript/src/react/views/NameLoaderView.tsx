import * as React from 'react';

export class NameLoaderProps {
  public staticName: string;
}

export class NameLoaderViewProps extends NameLoaderProps {
  public appName: string;
  public handleClick: () => void;
}

// View that displays a button to call the server
export class NameLoaderView extends React.Component<NameLoaderViewProps, {}> {
  render() {
    return <div>
      <h1>{this.props.staticName}</h1>
      <p>Hello {this.props.staticName}</p>
      <input type="button" value="Get appname" onClick={this.props.handleClick} />
      <p>{this.props.appName}</p>
      </div>;
  }
}