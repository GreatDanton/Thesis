import React from 'react';
import ReactDOM from 'react-dom';

import { ChannelView } from './channelView.js';
import { HeView } from './HEView.js';
import { ResultsView } from './resultsView.js';
import GlobalStorage from '../scripts/globalStorage';

let Tabs = [
  {
    name: "Channel Design",
    render: <ChannelView />
  },
  {
    name: "HE",
    render: <HeView />
  },
  {
    name: "Results",
    render: <ResultsView />
  }
];

// Used for switching tabs at the top of the page
class TabsSwitcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tabs: Tabs, active: "Channel Design" };
    this.changeView = this.changeView.bind(this);
  }

  // on tab click add active class to clicked tab
  changeView(e) {
    let name = e.target.innerText;
    this.setState({ active: name }, this.renderNewView);
    GlobalStorage.activeTab = name;
  }

  // when component mounts, render correct view (according to currently active tab)
  componentDidMount() {
    this.renderNewView();
  }

  // render New View in main-window according to currently active element
  renderNewView() {
    let render_view;
    this.state.tabs.forEach(item => {
      if (item.name === this.state.active) {
        render_view = item.render;
      }
    });
    ReactDOM.render(render_view, document.getElementById('main-window'));
  }

  render() {
    // if active name is the same as the name of the tab, add active class to it
    let all_tabs = this.state.tabs.map((tab, index) => {
      return (
        <Tab
          Name={tab.name}
          active={(this.state.active === tab.name) ? "active" : ""}
          key={index}
          onClick={this.changeView} />
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
  render() {
    return (
      <div className={"tab-item " + this.props.active} onClick={this.props.onClick}>
        {this.props.Name}
      </div>
    )
  }
}


export { TabsSwitcher }