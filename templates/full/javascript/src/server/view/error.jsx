const React = require('react');
const ErrorMessage = require('../lib/error-message');
const PageComponent = require('./layout.jsx');

const ErrorComponent = props => (
  <PageComponent title="Error">
    <h1>{`${props.status} - ${props.title}`}</h1>
    <p>{props.message}</p>
    <p>{process.env.NODE_ENV === 'production' ? '' : props.stack}</p>
  </PageComponent>
);

module.exports = ErrorComponent;
