import React from 'react';


class RectangularChannel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="chart"></div>
            <h1> RectangularChannel </h1>
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