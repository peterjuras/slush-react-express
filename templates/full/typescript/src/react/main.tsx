import React = require('react');

class NameLoaderState {
  public appName: string;
}

class NameLoaderProps {
  public staticName: string;
}

class NameLoaderViewProps extends NameLoaderProps {
  public appName: string;
  public handleClick: () => void;
}

// View that displays a button to call the server
class NameLoaderView extends React.Component<NameLoaderViewProps, {}> {
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
React.render(<NameLoader staticName="<%= appname %>" />, document.getElementById('content'));