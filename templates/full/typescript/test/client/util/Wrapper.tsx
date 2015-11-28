import * as React from 'react';

export default class Wrapper extends React.Component<{children? : React.ReactChildren}, {}> {
  render() {
    return <div>{this.props.children}</div>;
  }
}
