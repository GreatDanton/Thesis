import React from 'react';
import ReactDOM from 'react-dom';

// custom imports
import {InputBox} from '../commonParts/inputBoxes.js';
import {ScatterChart} from '../commonParts/charts.js';

import GlobalStorage from '../../scripts/globalStorage';


class RectangularChannel extends React.Component {
    constructor(props) {
        super(props);
        this.storage = GlobalStorage.channelTab.rectangular;
        this.state = ({
            h: this.storage.h,
            B: this.storage.B,
            ng: this.storage.ng,
            φ: this.storage.φ,
            P: this.storage.P,
            S: this.storage.S
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
        let id = event.target.id;
        let value = event.target.value;
        let calculateIf = ['B', 'h'];
        this.setState({[id]: value},
        function() {
            if (calculateIf.indexOf(id) > -1) {
                this.storage.S = this.area();
                this.storage.P = this.circumference();
                console.log(GlobalStorage);
            }
        });
        this.storage[id] = value;
    }

    calculate() {
        this.setState({"S": this.area(), "P": this.circumference()})
        this.storage.S = this.area;
        this.storage.P = this.circumference();
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
        this.storage = GlobalStorage.channelTab.trapezoid;
        this.state = ({
            B: this.storage.B,
            b: this.storage.b,
            h: this.storage.h,
            ng: this.storage.ng,
            φ: this.storage.φ,
            S: this.storage.S,
            P: this.storage.P
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
        let value = event.target.value;
        let id = event.target.id;
        let calculateIf = ['B', 'b','h'];

        this.setState({[id]: value},
        function() {  // callback function
            if (calculateIf.indexOf(id) > 0) {
                this.storage.S = this.area();
                this.storage.P = this.circumference();
                console.log(GlobalStorage);
            }
        });
        this.storage[id] = value; // save value of input into global storage
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
        this.storage = GlobalStorage.channelTab.custom;
        this.state = {points: this.storage.points, x: '', y: ''};
        this.onChange = this.onChange.bind(this);
        this.addPoint = this.addPoint.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
    }

    // add new point to state
    addPoint(e) {
        e.preventDefault();
        // if x & y are numbers, add them to the table
        let X = parseFloat(this.state.x);
        let Y = parseFloat(this.state.y);
        if (!isNaN(X) && !isNaN(Y)) { // if x and y is number
            let p = {x: X, y: Y};
            let points = this.state.points.slice();
            points.push(p);
            this.setState({points: points, x: '', y: ''}); // add new array, and reset input fields
            this.storage.points = points; // save points array into storage
        }
    }

    onChange(e) {
        this.setState({[e.target.id]: e.target.value});
    }

    deleteClick(e) {
        let X = e.currentTarget.getAttribute('x');
        let Y = e.currentTarget.getAttribute('y');
        let points_arr = [];
        this.state.points.map(point => {
            // if x or y are not the same, push it to points array (this filters out unwanted point)
            if (X !== point.x || Y !== point.y) {
                points_arr.push(point);
            }
        })
        this.setState({points: points_arr});
        this.storage.points = points_arr;
    }

    render() {

        return (
                <div className="container-900">
                    <div className="row">
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

                            <div className="row margin-u-40">
                                <div className="col-80">
                                    <PointsTable data={this.state.points} onClick={this.deleteClick} />
                                </div>
                                <div className="col-20">
                                    <NgTable  displayInputs={this.state.points} />
                                </div>
                            </div>
                        </div>
                        <div className="col-70 padding-h-20">
                            <ScatterChart name={["custom channel"]} data={[this.state.points]} pointBorder={'y'} />
                        </div>
                    </div>
                </div>
        )
    }
}


// custom channel renders ng input for number of points -1
class NgTable extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.storage = GlobalStorage.channelTab.custom.ngInputs;
        // state is present in order to change inputs later, otherwise we cannot change inputs after initial input
        this.state = {inputValues: this.storage};
    }

    onChange(e) {
        let id = e.target.id;
        let value = e.target.value;
        this.storage[id] = value;
        this.setState({inputValues: this.storage});
    }

    render() {
        let points = this.props.displayInputs;
        let numOfPoints = points.length - 1;
        let displayInputs = [];

        if (numOfPoints > 0) {
            for (let i = 0; i < numOfPoints; i++) {
                displayInputs.push(
                    <tr key={i}>
                        <td>
                            <input id={i} type="text" className="ngInput" onChange={this.onChange} value={this.storage[i]}/>
                        </td>
                    </tr>
                )
            }
        }

        return (
                <table className="ngTable">
                    <thead>
                        <tr>
                            <th> ng </th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayInputs}
                    </tbody>
                </table>
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
                    <TableRow x={point.x}  y={point.y} key={index}
                        onClick={this.props.onClick} />
                )
        });

        return (
            <table className="zebra">
                <thead>
                    <tr>
                        <th> </th>
                        <th> x </th>
                        <th> y </th>
                    </tr>
                </thead>
                <tbody>
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
                <td className="td-delete" onClick={this.props.onClick}
                    x={this.props.x}  y={this.props.y}> × </td>
                <td> {this.props.x} </td>
                <td> {this.props.y} </td>
            </tr>
        )
    }
}

export {RectangularChannel, TrapezoidChannel, CustomChannel};

