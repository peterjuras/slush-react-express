const React = require('react');

const PageComponent = props => (
  <html>
    <head>
      <title>{props.title}</title>
    </head>
    <body style={{ padding: '50px', font: '14px "Lucida Grande", Helvetica, Arial, sans-serif' }}>
      {props.children}
    </body>
  </html>
);

module.exports = PageComponent;
