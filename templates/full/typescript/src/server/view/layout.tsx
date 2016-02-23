import * as React from 'react';

// Note: TypeScript 1.6 does not support stateless components yet, we have to
// escape the type with any for now.
const PageComponent = (props : { title: string, children?: React.ReactChildren }) => (
  <html>
    <head>
      <title>{props.title}</title>
    </head>
    <body style={{ padding: '50px', font: '14px "Lucida Grande", Helvetica, Arial, sans-serif' }}>
      {props.children}
    </body>
  </html>
);

export default PageComponent;
