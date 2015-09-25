import React = require('react');

class NameLoaderProps {
  public staticname: string;
}

class NameLoaderState {
  public appname: string;
}

class NameLoader extends React.Component<NameLoaderProps, NameLoaderState> {
  constructor(props : NameLoaderProps) {
    super(props);
    this.state = {
      appname: ''
    };
  }
  handleClick = () => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api', true);
    xhr.onload = () => {
      this.setState({ appname: xhr.responseText });
    }
    xhr.send();
  }
  render() {
    return (
      <div>
        <h1>{this.props.staticname}</h1>
        <p>Hello {this.props.staticname}</p>
        <input type="button" value="Get app name" onClick={this.handleClick} />
        <p>{this.state.appname}</p>
      </div>
    );
  }
}

React.render(<NameLoader staticname="<%= appname %>" />, document.getElementById('content'));