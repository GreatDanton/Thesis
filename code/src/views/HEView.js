import React from 'react';

import { InputBox } from '../components/commonParts/inputBoxes';
import GlobalStorage from '../scripts/globalStorage';

class HeView extends React.Component {
    render() {
        return (
            <Turbine />
        )
    }
}

// Turbine component renders boxes for changing turbine parameters
class Turbine extends React.Component {
    constructor(props) {
        super(props)
        this.storage = GlobalStorage.HETAb;
        this.state = {
            Qmin: this.storage.Qmin,
            Qmax: this.storage.Qmax,
            Qteh: this.storage.Qteh,
            H: this.storage.H,
            η: this.storage.η
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        let id = e.target.id;
        let value = e.target.value;
        this.setState({
            [id]: value
        });
        this.storage[id] = value;
    }

    render() {
        return (
            <div>
                <div className="container-900">
                    <div className="row">
                        <div className="col-30">
                            <InputBox id="Qmin" end="m^3/s" onChange={this.onChange} value={this.state.Qmin} />
                            <InputBox id="Qmax" end="m^3/s" onChange={this.onChange} value={this.state.Qmax} />
                            <InputBox id="Qteh" end="m^3/s" onChange={this.onChange} value={this.state.Qteh} tooltip='Maximum technical flow' />
                            <InputBox id="H" end="m" onChange={this.onChange} value={this.state.H} />
                            <br />
                            <InputBox id="η" end="%" onChange={this.onChange} value={this.state.η} />
                        </div>
                        <div className="col-70">
                            <img className="img-guide" src="images/powerplant_crossSection.svg" alt="Powerplant cross section" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export { HeView }