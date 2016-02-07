const React = require('react');
const ErrorMessage = require('../lib/error-message');
const PageComponent = require('./layout.jsx');

const ErrorComponent = props => (
  <PageComponent title="Error">
    <h1>{`${props.status} - ${props.title}`}</h1>
    <p>{props.message}</p>
    <pre>{process.env.NODE_ENV === 'production' ? '' : props.stack}</pre>
  </PageComponent>
);

module.exports = ErrorComponent;
