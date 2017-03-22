import React from 'react';
import ReactDOM from 'react-dom';

// my components imports
import {Toolbar} from '../views/toolbar.js';
import {TabsSwitcher} from '../views/tabsSwitcher.js';

window.onload = function(){
/*  ReactDOM.render(<Toolbar />, document.getElementById('toolbar'));*/
  ReactDOM.render(<TabsSwitcher />, document.getElementById('tabs-switcher'));
}
