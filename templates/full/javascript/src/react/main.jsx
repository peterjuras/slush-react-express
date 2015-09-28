var react = require('react');

var NameLoader = react.createClass({
  getInitialState: function () {
    return { appname: '' };
  },
  handleClick: function () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api', true);
    xhr.onload = function () {
      this.setState({ appname: xhr.responseText });
    }.bind(this);
    xhr.send();
  },
  render: function () {
    return (
      <div>
        <h1>{this.props.staticname}</h1>
        <p>Hello {this.props.staticname}</p>
        <input type="button" value="Get app name" onClick={this.handleClick} />
        <p>{this.state.appname}</p>
      </div>
    );
  }
});

react.render(<NameLoader staticname="<%= appname %>" />, document.getElementById('content'));