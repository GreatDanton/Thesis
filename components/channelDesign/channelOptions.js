import React from 'react';
import ReactDOM from 'react-dom';

import {RectangularChannel, TrapezoidChannel, CustomChannel} from './channelParameters.js';

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
        this.state = {options: Options, selectedOption: "Rectangular"};
        this.handleChange = this.handleChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    // on card click select correct radio button
    onClick(e) {
        let id = e.currentTarget.id.split('-')[1]; // returns id part of 'card-id'
        this.setState({selectedOption: id}, this.renderParams);
    }

    // change selectedOption to currently selected radio button
    handleChange(e) {
        this.setState({selectedOption: e.target.value}, this.renderParams);
    }

    renderParams() {
        let render;
        this.state.options.map(option => {
            if (option.id === this.state.selectedOption) {
                render = option.render;
            }
        })

        ReactDOM.render(
            render, document.getElementById('channel-parameters')
        )
    }

    componentDidMount() {
        this.renderParams();
    }

    // use componentDidUnmount to save state (:, and componentWillMount to load states
    // to local storage???


    render() {
        let cards = this.state.options.map((option, index) => {
            return (
                <div className="col-33" key={index}
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
            <form className="channel-options">
                <div className="row">
                    {cards}
                </div>
            </form>
            </div>
        )
    }
}


class Card extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.active?'card active':'card'} >

                <div className="centered">
                    <label htmlFor={this.props.id}>{this.props.id}</label>

                    <img className={this.props.active?"channel-thumbnail active":"channel-thumbnail"}
                     src={this.props.image} />

                    <input type="radio" id={this.props.id}
                     onChange={this.props.onChange} value={this.props.value}
                     checked={this.props.checked} />
                </div>
            </div>
        )
    }
}


export {ChannelOptions};