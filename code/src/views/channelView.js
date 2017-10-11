import React from 'react';
import ReactDOM from 'react-dom';

import { RectangularChannel, TrapezoidChannel, CustomChannel } from '../components/channelParameters';
import { createConsumptionCurve } from '../scripts/calculationHelpers';
import GlobalStorage from '../scripts/globalStorage';


class ChannelView extends React.Component {
    constructor(props) {
        super(props);
        this.storage = GlobalStorage.channelTab;
    }
    render() {
        return (
            <div>
                <ChannelOptions />
                <div id="channel-parameters"></div>
            </div>
        )
    }
}


let Options = [
    {
        id: "Rectangular",
        img: "images/rectangularChannel.svg",
        render: <RectangularChannel />
    },
    {
        id: "Trapezoid",
        img: "images/trapezoidChannel.svg",
        render: <TrapezoidChannel />
    },
    {
        id: "Custom",
        img: "images/customChannel.svg",
        render: <CustomChannel />
    }
]

// select from common channel options (depending on your channel type)
class ChannelOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = { options: Options, selectedOption: "Rectangular" };
        this.handleChange = this.handleChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    // load selected channel when component will mount
    componentWillMount() {
        let selectedChannel = GlobalStorage.channelTab.active;
        if (selectedChannel.length > 0) { // if active tab exist in GlobalStorage load it
            this.state.options.forEach(option => {
                if (option.id === selectedChannel) {
                    this.setState({ selectedOption: selectedChannel }, this.renderParams);
                }
            });
        }
    }

    // save selected channel and consumption curve for active channel to global storage
    componentWillUnmount() {
        let activeChannel = this.state.selectedOption;
        GlobalStorage.channelTab.active = activeChannel;
        GlobalStorage.channelTab.consumptionCurve = createConsumptionCurve(activeChannel);
    }

    // on card click select correct radio button
    onClick(e) {
        let id = e.currentTarget.id.split('-')[1]; // returns id part of 'card-id'
        this.setState({ selectedOption: id }, this.renderParams);
    }

    // change selectedOption to currently selected radio button
    handleChange(e) {
        this.setState({ selectedOption: e.target.value }, this.renderParams);
    }

    renderParams() {
        let render;
        this.state.options.forEach(option => {
            if (option.id === this.state.selectedOption) {
                render = option.render;
            }
        });
        ReactDOM.render(
            render, document.getElementById('channel-parameters')
        )
    }

    componentDidMount() {
        this.renderParams();
    }

    render() {
        let cards = this.state.options.map((option, index) => {
            return (
                <div className="col-30" key={index}
                    id={"card-" + option.id} onClick={this.onClick}>
                    <Card id={option.id} value={option.id}
                        image={option.img}
                        active={this.state.selectedOption === option.id}
                        checked={this.state.selectedOption === option.id}
                        onChange={this.handleChange} />
                </div>
            );
        });

        return (
            <div className="container-900">
                <div className="row space-around margin-b-40">
                    {cards}
                </div>
            </div>
        )
    }
}


// Card renders cards for picking channel geometry
// (Rectangular channel, Trapezoid channel, Custom channel)
class Card extends React.Component {
    render() {
        return (
            <div className={this.props.active ? 'card active' : 'card'} >
                <div className="centered">
                    <label htmlFor={this.props.id}>{this.props.id}</label>
                    <img className={this.props.active ? "channel-thumbnail active" : "channel-thumbnail"}
                        src={this.props.image} alt="" />
                    <input type="radio" id={this.props.id}
                        onChange={this.props.onChange} value={this.props.value}
                        checked={this.props.checked} />
                </div>
            </div>
        )
    }
}

export { ChannelView }