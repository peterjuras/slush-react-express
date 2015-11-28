import * as React from 'react';
import { render } from 'react-dom';
import { NameLoaderView, SharedProps } from './view/NameLoaderView';

import '../style/index.<%= styleExt %>!';

// Tell react to render the component
render(<NameLoader staticName="<%= appname %>" />, document.getElementById('content'));
