// View that displays a button to call the server
var NameLoaderView = React.createClass({
  render: function() {
    return (
      <div>
        <h1>{this.props.staticName}</h1>
        <p>Hello {this.props.staticName}</p>
        <input type="button" value="Get app name" onClick={this.props.handleClick} />
        <p>{this.props.appName}</p>
      </div>
    );
  }
});

// React component that handles the button click
var NameLoader = React.createClass({
  getInitialState: function () {
    return { appName: '' };
  },
  handleClick: function () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api', true);
    xhr.onload = function () {
      this.setState({ appName: xhr.responseText });
    }.bind(this);
    xhr.send();
  },
  render: function () {
    return <NameLoaderView appName={this.state.appName} staticName={this.props.staticName} handleClick={this.handleClick} />;
  }
});

// Tell react to render the component
React.render(<NameLoader staticName="<%= appname %>" />, document.getElementById('content'));