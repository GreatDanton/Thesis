import React from 'react';
import ReactDOM from 'react-dom';

// my components imports
import GlobalStorage from './globalStorage'
import {ToolbarButtons} from '../views/toolbarButtons.js';
import {TabsSwitcher} from '../views/tabsSwitcher.js';
import {createMonthlyFlow, getExtremeFlow, createGraphData, getAverageData} from './parseCsv.js';

window.onload = function(){
  console.log(GlobalStorage);

  ReactDOM.render(<ToolbarButtons />, document.getElementById('toolbar-buttons'));
  ReactDOM.render(<TabsSwitcher />, document.getElementById('tabs-switcher'));
}
