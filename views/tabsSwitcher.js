import React from 'react';
import ReactDOM from 'react-dom';

import {ChannelView} from './channelView.js';
import {HeView} from './HEView.js';
import {ResultsView} from './resultsView.js';

let Tabs = [
        {
        name: "Channel",
        },
        {
            name: "HE",
        },
        {
            name: "Results",
        }
    ];

// Used for switching tabs at the top of the page
class TabsSwitcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tabs: Tabs, active: "Channel"};
    this.changeView = this.changeView.bind(this);
  }

// on tab click add active class to clicked tab
  changeView(e) {
      let name = e.target.innerText;
      this.setState({active: name}, this.renderNewView);
      // console.log(this.state.active);
  }

// when component mounts, render correct view (according to currently active tab)
componentDidMount() {
    this.renderNewView();
}

// render New View in main-window according to currently active element
  renderNewView() {
    let render_view;
    if (this.state.active === "Channel") {
        render_view = <ChannelView />
    } else if (this.state.active === "HE") {
        render_view = <HeView />
    } else if (this.state.active === "Results") {
        render_view = <ResultsView />
    }

    ReactDOM.render(
        render_view,
        document.getElementById('main-window')
    )
  }


  render() {
      // if active name is the same as the name of the tab, add active class to it
      let all_tabs = this.state.tabs.map((tab,index) => {
          return (
            <Tab Name={tab.name} active={(this.state.active === tab.name)?"active":""}
            key={index} onClick={this.changeView} />
          );
      });

    return (
      <div id="main-tab-container" className="tab-group">
            {all_tabs}
      </div>
    )
  }
}


// For rendering each tab
class Tab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={"tab-item " + this.props.active} onClick={this.props.onClick}>
        {this.props.Name}
      </div>
    )
  }
}


export {TabsSwitcher}