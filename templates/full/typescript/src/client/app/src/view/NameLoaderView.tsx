import * as React from 'react';

export interface SharedProps extends React.Props<any> {
  staticName: string;
}

interface NameLoaderProps extends SharedProps {
  handleClick: () => void;
  appName: string;
}

// View that displays a button to call the server
export const NameLoaderView = (props: NameLoaderProps) => (
  <div>
    <h1>{props.staticName}</h1>
    <p>Hello {props.staticName}</p>
    <input type="button" value="Get app name" onClick={props.handleClick} />
    <p>{props.appName}</p>
  </div>
);
