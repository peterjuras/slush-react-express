import React from 'react';
import { render } from 'react-dom';
import NameLoader from './view/NameLoader';

import './style/index.<%= styleExt %>!';

// Tell react to render the component
render(<NameLoader staticName="<%= appname %>" />, document.getElementById('content'));
