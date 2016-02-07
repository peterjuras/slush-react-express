import * as React from 'react';
import ErrorMessage from '../lib/error-message';
import PageComponent from './layout.tsx';

const ErrorComponent = (props : ErrorMessage) => (
  <PageComponent title="Error">
    <h1>{`${props.status} - ${props.title}`}</h1>
    <p>{props.message}</p>
    <pre>{process.env.NODE_ENV === 'production' ? '' : props.stack}</pre>
  </PageComponent>
);

export default ErrorComponent;
