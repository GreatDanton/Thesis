import React from 'react';

import {InputBox} from '../commonParts/inputBoxes.js';

class RectangularChannel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1> RectangularChannel </h1>

                <div className="row">
                    <div className="small-9 columns">
                       {/*place for chart = diagram*/}

                    </div>

                    <div className="small-3 columns">
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




class TrapezoidChannel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="chart"></div>
                <h1> Trapezoid Channel </h1>
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
                <h1> Custom channel </h1>
            </div>
        )
    }
}

export {RectangularChannel, TrapezoidChannel, CustomChannel};