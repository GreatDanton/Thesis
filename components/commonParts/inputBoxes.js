import React from 'react';


class InputBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <form>
                <div className="row">
                    <div className="small-3 columns no-padding">
                        <label className="text-right middle" htmlFor={this.props.id}>{this.props.id}</label>
                    </div>
                    <div className="small-7 columns">
                        <input type="text" id={this.props.id} value={this.props.value}/>
                    </div>
                    <div className="small-2 columns no-padding">
                        <label className="middle" htmlFor={this.props.id}>{ '['+(this.props.end)+']' } </label>
                    </div>
                </div>
            </form>


        )
    }
}

export {InputBox};