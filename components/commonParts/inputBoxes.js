import React from 'react';


class InputBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="one-line">
                <label htmlFor={this.props.id}>{this.props.id}</label>
                <input type="text" id={this.props.id} value={this.props.value}/> {this.props.end}
            </div>
        )
    }
}

export {InputBox};