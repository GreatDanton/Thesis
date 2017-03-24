import React from 'react';
import ReactDOM from 'react-dom';

// my components imports
import {Toolbar} from '../views/toolbar.js';
import {TabsSwitcher} from '../views/tabsSwitcher.js';
import {createMonthlyFlow, getExtremeFlow, createGraphData} from './parseCsv.js';

window.onload = function(){
let sample_csv = `
1.1.2010,50.00
2.1.2010,55.0
3.1.2010,60.0
4.1.2010,75.5
5.1.2010,50.25
1.2.2010,10.25
5.3.2011,10
2.5.2012,4
`
  let waterFlow = createMonthlyFlow(sample_csv);
  console.log(getExtremeFlow(waterFlow));
  createGraphData(2010, waterFlow);
//  console.log(createMonthlyFlow(sample_csv));
/*  ReactDOM.render(<Toolbar />, document.getElementById('toolbar'));*/
  ReactDOM.render(<TabsSwitcher />, document.getElementById('tabs-switcher'));
}
