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
        let B = parseFloat(this.state.B);
        let x = (B - b) / 2

        let P = b + 2 * ( x**2 + h**2 )**(1/2);
        return P
    }

    area() {
        let b = parseFloat(this.state.b);
        let h = parseFloat(this.state.h);
        let B = parseFloat(this.state.B);
        let x = (B - b) / 2;

        let S = b * h + x * h
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
        this.state = {points: [], x: '', y: ''};
        this.onChange = this.onChange.bind(this);
        this.addPoint = this.addPoint.bind(this);
    }

    // add new point to state
    addPoint(e) {
        e.preventDefault();
        // if x & y are numbers, add them to the table
        if (parseFloat(this.state.x) && parseFloat(this.state.y)) {
            let p = {x: this.state.x, y: this.state.y};
            let points = this.state.points.slice();
            points.push(p);
            this.setState({points: points, x: '', y: ''}); // add new array, and reset input fields
        }
    }

    onChange(e) {
        this.setState({[e.target.id]: e.target.value});
    }

    render() {
        return (
            <div>
                <h2> Custom channel </h2>

                <div className="container-900">
                    <div className="col-30">
                        {/* button press on enter click will submit the form => execute addPoint*/}
                        <form onSubmit={this.addPoint}>
                        <div className="row centered">
                            <InputBox id="x" end="" value={this.state.x} onChange={this.onChange} />
                            <InputBox id="y" end="" value={this.state.y} onChange={this.onChange} />
                        </div>
                        <div className="row centered">
                            <button type="submit" className="btn btn-primary"> Add </button>
                        </div>
                        </form>
                        <PointsTable data={this.state.points} />
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
        let TableRows = this.props.data.map((point, index) => {
                return (
                    <TableRow x={point.x}  y={point.y} key={index} />
                )
        });

        return (
            <table className="zebra margin-u-40">
                <thead>
                    <tr>
                        <th> x </th>
                        <th> y </th>
                    </tr>
                </thead>
                <tbody>
                    <TableRow x={1} y={2} />
                    {TableRows}
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

