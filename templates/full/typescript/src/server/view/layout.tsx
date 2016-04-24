import * as React from 'react';

interface PageProps extends React.Props<any> {
  title: string;
}

const PageComponent = (props: PageProps) => (
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
