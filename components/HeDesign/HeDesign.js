import React from 'react';

import {InputBox} from '../commonParts/inputBoxes.js';

class HeDesign extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <div className="container-900">
                    <div className="row">
                        <div className="col-30">
                            <InputBox id="Q" end="m^3/s" />
                            <InputBox id="Δh" end="m" />
                            <br/>
                            <InputBox id="η" end="%" />
                        </div>
                        <div className="col-70">
                            <img className="img-guide" src="images/powerplant_crossSection.svg" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export {HeDesign}