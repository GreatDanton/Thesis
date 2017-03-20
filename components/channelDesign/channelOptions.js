import React from 'react';


let Options = [
            {
                id: "Rectangular",
                img: ""
            },
            {
                id: "Trapezoid",
                img: ""
            },
            {
                id: "Custom",
                img: ""
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
        e.preventDefault(); // prevents double selecting
        this.setState({selectedOption: e.currentTarget.id});
    }

    handleChange(e) {
        this.setState({selectedOption: e.target.value});
    }


    render() {
        let cards = this.state.options.map((option, index) => {
            return (
                <div className="small-4 columns" id={option.id} key={index} onClick={this.onClick}>
                    <Card id={option.id} value={option.id}
                    checked={this.state.selectedOption === option.id}
                    onChange={this.handleChange}/>
                </div>
            );
        });

        return (
            <form>
            <div className="row">
                {cards}
            </div>
            </form>
        )
    }
}


class Card extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="card">
                <div className="centered">
                    <label htmlFor={this.props.id}>{this.props.id}</label><br/>
                    <img src={this.props.image} />

                    <input type="radio" id={this.props.id}
                     onChange={this.props.onChange} value={this.props.value}
                     checked={this.props.checked} />
                </div>
            </div>
        )
    }
}


export {ChannelOptions};