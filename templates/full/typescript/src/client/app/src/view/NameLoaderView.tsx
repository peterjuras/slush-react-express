import * as React from 'react';

export interface SharedProps {
  staticName: string;
}

interface NameLoaderProps extends SharedProps {
  handleClick: () => void;
  appName: string;
}

// View that displays a button to call the server
// Note: TypeScript 1.6 does not support stateless components yet, we have to
// escape the type with any for now.
export const NameLoaderView : any = (props : NameLoaderProps) => (
  <div>
    <h1>{props.staticName}</h1>
    <p>Hello {props.staticName}</p>
    <input type="button" value="Get app name" onClick={props.handleClick} />
    <p>{props.appName}</p>
  </div>
);
