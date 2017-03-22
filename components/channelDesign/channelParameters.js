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
                <div className="row">
                    <div className="small-9 columns">
                       {/*place for chart = diagram*/}
                       <img className="img-guide" src="images/rectangularChannel_guide.svg" />
                       <img className="img-level-guide" src="images/vertical_crossSection.svg" />
                    </div>

                    <div className="small-3 columns">
                        <InputBox id="B" end="m" />
                        <InputBox id="h" end="m" />
                        <br/>
                        <InputBox id="ng" end="/" />
                        <InputBox id="i" end="%" />
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
                <div className="row">
                    <div className="small-9 columns">
                       {/*place for chart = diagram*/}
                       <img className="img-guide" src="images/trapezoidChannel_guide.svg" />
                       <img className="img-level-guide" src="images/vertical_crossSection.svg" />
                    </div>

                    <div className="small-3 columns">
                        <InputBox id="B" end="m" />
                        <InputBox id="b" end="m" />
                        <InputBox id="h" end="m" />
                        <br/>
                        <InputBox id="ng" end="/" />
                        <InputBox id="i" end="%" />
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

                <div className="row">
                    <div className="small-9 columns">
                       {/*place for chart = diagram*/}
                       <p> </p>
                    </div>

                    <div className="small-3 columns">
                            <InputBox id="b" end="m" />
                            <InputBox id="h" end="m" />
                    </div>
                </div>
            </div>
        )
    }
}


export {RectangularChannel, TrapezoidChannel, CustomChannel};

