import React from 'react';

import {InputBox} from '../commonParts/inputBoxes.js';

class RectangularChannel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="chart"></div>
                <h1> RectangularChannel </h1>
                <InputBox id="b" end="m" />
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