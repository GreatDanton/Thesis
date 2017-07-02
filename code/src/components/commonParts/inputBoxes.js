import React from 'react';


class InputBox extends React.Component {

    render() {

        return (
            <div className="input-field" title={this.props.tooltip? this.props.tooltip: ''}>
                <div className="row">
                        <label htmlFor={this.props.id}>{this.props.id}</label>
                        <input type="text" id={this.props.id} value={this.props.value} onChange={this.props.onChange}/>
                        {this.props.end ?
                            <label htmlFor={this.props.id}>
                                {'[' + this.props.end + ']'}
                            </label>
                            : ''
                        }
                </div>
            </div>

        )
    }
}

export {InputBox};
