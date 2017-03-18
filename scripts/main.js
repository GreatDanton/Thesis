import React from 'react';
import ReactDOM from 'react-dom';
import {Main} from '../views/main.js';

window.onload = function(){
  ReactDOM.render(<Main />, document.getElementById('tabs-switcher'));
}
