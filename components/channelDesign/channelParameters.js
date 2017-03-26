import React from 'react';
import ReactDOM from 'react-dom';

// custom imports
import {InputBox} from '../commonParts/inputBoxes.js';



class RectangularChannel extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            h: '',
            B: '',
            ng: '',
            φ: '',
        });
        this.handleChange = this.handleChange.bind(this);
        this.calculate = this.calculate.bind(this);
    }

    circumference() {
        let h = parseFloat(this.state.h);
        let B = parseFloat(this.state.B);
        let P = 2 * h + B;
        return P
    }

    area() {
        let h = parseFloat(this.state.h);
        let B = parseFloat(this.state.B);
        let S = h * B;
        return S;
    }

    handleChange(event) {
        this.setState({[event.target.id]: event.target.value});
        if (event.target.id === 'B' || event.target.id === 'b') {
            console.log('hey');
        }
    }

    calculate() {
        console.log('S: ' + this.area());
        console.log('P: ' + this.circumference());
    }

    render() {
        return (
            <div>
                <div className="container-900">
                    <div className="row">
                        <div className="col-30">
                            <InputBox id="B" end="m" value={this.state.B} onChange={this.handleChange} />
                            <InputBox id="h" end="m" value={this.state.h} onChange={this.handleChange}/>
                            <br/>
                            <InputBox id="ng" end="/" value={this.state.ng} onChange={this.handleChange}/>
                            <InputBox id="φ" end="%" value={this.state.φ} onChange={this.handleChange}/>
                            <div className="btn btn-primary" onClick={this.calculate}> Calculate </div>
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
        this.state = ({
            B: '',
            b: '',
            h: '',
            ng: '',
            φ: ''
        });
        this.handleChange = this.handleChange.bind(this);
    }

    circumference() {
        let b = parseFloat(this.state.b);
        let h = parseFloat(this.state.h);
        let P = b + 2 * (b^2 + h^2 )^(1/2);
        return P
    }

    area() {
        // check for different types of input -> either via B or angle
        let b = parseFloat(this.state.b);
        let h = parseFloat(this.state.h);
        let B = parseFloat(this.state.B);
        let S = b * h + (B - b) / 2 * h
        return S
    }

    handleChange(event) {
        this.setState({[event.target.id]: event.target.value},
        function() {  // callback function
            console.log('area: ' + this.area());
            console.log('circumference: ' + this.circumference());
        }
        );
    }

    render() {
        return (
            <div>
                <div className="container-900">
                    <div className="row">
                        <div className="col-30">
                            <InputBox id="B" end="m" value={this.state.B} onChange={this.handleChange} />
                            <InputBox id="b" end="m" value={this.state.b} onChange={this.handleChange} />
                            <InputBox id="h" end="m" value={this.state.h} onChange={this.handleChange} />
                            <br/>
                            <InputBox id="ng" end="/" value={this.state.ng} onChange={this.handleChange} />
                            <InputBox id="φ" end="%" value={this.state.φ} onChange={this.handleChange} />
                        </div>
                        <div className="col-70">
                            <img className="img-guide" src="images/trapezoidChannel_guide.svg" />
                            <img className="img-level-guide" src="images/vertical_crossSection.svg" />
                        </div>
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
                    <div className="col-30">
                        <div className="row centered">
                            <InputBox id="x" end="" />
                            <InputBox id="y" end="" />
                        </div>
                        <div className="row centered">
                            <div className="btn btn-primary"> Add </div>
                        </div>
                        <PointsTable />
                    </div>
                    <div className="col-70">
                    </div>
                </div>
            </div>
        )
    }
}

class PointsTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <table className="zebra margin-u-40">
                <thead>
                    <tr>
                        <th> x </th>
                        <th> y </th>
                    </tr>
                </thead>
                <tbody>
                    <TableRow x={1} y={1} />
                    <TableRow x={2} y={2} />
                </tbody>
            </table>
        )
    }
}

class TableRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr>
                <td> {this.props.x} </td>
                <td> {this.props.y} </td>
            </tr>
        )
    }
}

export {RectangularChannel, TrapezoidChannel, CustomChannel};

