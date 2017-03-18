'use babel';

import React from 'react';
import {TabsSwitcher} from './tabsSwitcher.js';

class Main extends React.Component {
  render() {
    return (
    <div>
    <TabsSwitcher />
    <p> This is main page, we will import stuff here </p>
    </div>
    )
  }
}



export {Main};
