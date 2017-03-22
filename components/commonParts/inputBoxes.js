import React from 'react';


class InputBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="input-field">
                <div className="row">
                        <label htmlFor={this.props.id}>{this.props.id}</label>
                        <input type="text" id={this.props.id} value={this.props.value}/>
                        <label htmlFor={this.props.id}>
                            { this.props.end ?  '['+(this.props.end)+']' : '' }
                        </label>
                </div>
            </div>

        )
    }
}

export {InputBox};
{/*                    <div className="row">
                        <div className="small-3 columns no-padding">
                            <label className="text-right middle" htmlFor={this.props.id}>{this.props.id}</label>
                        </div>
                        <div className="small-7 columns">
                            <input type="text" id={this.props.id} value={this.props.value}/>
                        </div>
                        <div className="small-2 columns no-padding">
                            <label className="middle" htmlFor={this.props.id}>
                                { this.props.end ?  '['+(this.props.end)+']' : '' }
                            </label>
                        </div>
                    </div>*/}
