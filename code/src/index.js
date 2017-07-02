import React from 'react';
import ReactDOM from 'react-dom';
// custom imports
import GlobalStorage from './scripts/globalStorage';
import {ToolbarButtons} from './views/toolbarButtons.js';
import {TabsSwitcher} from './views/tabsSwitcher.js';

import registerServiceWorker from './registerServiceWorker';
  console.log(GlobalStorage);
  ReactDOM.render(<ToolbarButtons />, document.getElementById('toolbar-buttons'));
  ReactDOM.render(<TabsSwitcher />, document.getElementById('tabs-switcher'));

registerServiceWorker();
