import React from 'react';
import ReactDOM from 'react-dom';

// custom imports
import {InputBox} from '../commonParts/inputBoxes.js';



class RectangularChannel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="container-900">
                    <div className="row">
                        <div className="col-30">
                            <InputBox id="B" end="m" />
                            <InputBox id="h" end="m" />
                            <br/>
                            <InputBox id="ng" end="/" />
                            <InputBox id="φ" end="%" />
                        </div>
                        <div className="col-70">
                            <img className="img-guide" src="images/rectangularChannel_guide.svg" />
                            <img className="img-level-guide" src="images/vertical_crossSection.svg" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}




class TrapezoidChannel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="container-900">
                    <div className="col-30">
                        <InputBox id="B" end="m" />
                        <InputBox id="b" end="m" />
                        <InputBox id="h" end="m" />
                        <br/>
                        <InputBox id="ng" end="/" />
                        <InputBox id="φ" end="%" />
                    </div>
                    <div className="col-70">
                       <img className="img-guide" src="images/trapezoidChannel_guide.svg" />
                       <img className="img-level-guide" src="images/vertical_crossSection.svg" />
                    </div>
                </div>
            </div>
        )
    }
}


class CustomChannel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h2> Custom channel </h2>

                <div className="container-900">
                    <div className="col-50">
                        <div className="row centered">
                            <InputBox id="x" />
                            <InputBox id="y" />
                        </div>
                        <div className="row centered">
                            <div className="btn btn-primary"> Add </div>
                        </div>
                    </div>
                    <div className="col-50">
                        <img className="img-guide" src="images/powerplant_crossSection.svg" />
                    </div>
                </div>
            </div>
        )
    }
}


export {RectangularChannel, TrapezoidChannel, CustomChannel};

