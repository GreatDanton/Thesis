import React from 'react';
import ReactDOM from 'react-dom';

// my components imports
import {ToolbarButtons} from '../views/toolbarButtons.js';
import {TabsSwitcher} from '../views/tabsSwitcher.js';
import {createMonthlyFlow, getExtremeFlow, createGraphData, getAverageData} from './parseCsv.js';

window.onload = function(){
let sample_csv = `
1.1.2010,50.00
2.1.2010,55.0
3.1.2010,60.0
4.1.2010,75.5
5.1.2010,50.25
1.2.2010,10.25
1.1.2011,5
5.3.2011,10
1.4.2011,10
2.5.2012,4
`
  let waterFlow = createMonthlyFlow(sample_csv);
  //console.log(waterFlow);
  //console.log(getExtremeFlow(waterFlow));
  //console.log(createGraphData(2011, waterFlow));
  getAverageData(waterFlow);
//  console.log(createMonthlyFlow(sample_csv));
/*  ReactDOM.render(<Toolbar />, document.getElementById('toolbar'));*/
  ReactDOM.render(<ToolbarButtons />, document.getElementById('toolbar-buttons'));
  ReactDOM.render(<TabsSwitcher />, document.getElementById('tabs-switcher'));
}
