import React from 'react';
import ReactDOM from 'react-dom';

// View that displays a button to call the server
var NameLoaderView = (props) => (
  <div>
    <h1>{props.staticName}</h1>
    <p>Hello {props.staticName}</p>
    <input type="button" value="Get app name" onClick={props.handleClick} />
    <p>{props.appName}</p>
  </div>
);

// React component that handles the button click
class NameLoader extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = { appName: '' };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api', true);
    xhr.onload = () => {
      this.setState({ appName: xhr.responseText });
    }
    xhr.send();
  }
  render() {
    return <NameLoaderView appName={this.state.appName} staticName={this.props.staticName} handleClick={this.handleClick} />;
  }
}

// Tell react to render the component
ReactDOM.render(<NameLoader staticName="<%= appname %>" />, document.getElementById('content'));