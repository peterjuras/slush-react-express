import React from 'react';

// View that displays a button to call the server
const NameLoaderView = props => (
  <div>
    <h1>{props.staticName}</h1>
    <p>Hello {props.staticName}</p>
    <input type="button" value="Get app name" onClick={props.handleClick} />
    <p>{props.appName}</p>
  </div>
);

export default NameLoaderView; 
