import React from 'react';

import {LineChart, BarChart, ScatterChart} from '../components/commonParts/charts.js';
import {rectangle_area, rectangle_circumference, trapezoid_area, trapezoid_circumference, ManningEquation} from '../scripts/shapeProperties';
//import {createMonthlyFlow, getExtremeFlow, createGraphData, getAverageData} from '../scripts/parseCsv.js';
import GlobalStorage from '../scripts/globalStorage';


class ResultsView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-900">
               <Hydrogram />
               <ConsumptionCurve />
            </div>
        )
    }
}



// create consumption curve out of active channel data
// TODO
class ConsumptionCurve extends React.Component {
    constructor(props) {
        super(props);
        this.storage = GlobalStorage.channelTab;
    }

    plot() {
        let activeChannel = this.storage.active;
        let points = [];

        if (activeChannel == 'Rectangular') {
            let h = parseFloat(this.storage.rectangular.h);
            let b = parseFloat(this.storage.rectangular.B);
            let ng = parseFloat(this.storage.rectangular.ng);
            let angle = parseFloat(this.storage.rectangular.φ);

            for (let i = 0; i < h; i += 0.01) {
                let area = rectangle_area(b, i);
                let circumference = rectangle_circumference(b, i);
                let Q = ManningEquation(area, circumference, ng, angle).toFixed(2);
                let Y = i.toFixed(2);
                points.push({'x': Q, 'y': Y});
            }
        } else if (activeChannel == 'Trapezoid') {
            let h = parseFloat(this.storage.trapezoid.h);
            let b = parseFloat(this.storage.trapezoid.b);
            let B = parseFloat(this.storage.trapezoid.B);
            let ng = parseFloat(this.storage.trapezoid.ng);
            let channelAngle = parseFloat(this.storage.trapezoid.φ);
            // calculate angle of sides
            let _x = (B - b) / 2
            let beta = (Math.atan(h / _x)) * 180 / Math.PI;

            for (let i = 0; i < h; i += 0.01) {
                let area = trapezoid_area(b, i, beta);
                let circumference = trapezoid_circumference(b, h, beta);
                let Q = ManningEquation(area, circumference, ng, channelAngle).toFixed(2);
                let Y = i.toFixed(2);
                points.push({'x': Q, 'y': Y});
            }
        } else if (activeChannel == 'Custom') {
            console.log('custom');
        }

        let pointsArray = [points];
        return pointsArray;
    }

    render() {
        let data = this.plot();
        if (data[0].length === 0) {
            return (
                <div className="data-not-imported">
                    <h2>  Add channel parameters to see consumption curve </h2>
                </div>
            )
        } else {
            return (
                <div>
                    <h3> Consumption curve </h3>
                    <ScatterChart data={data} name={["consumption curve"]} smooth={'y'} xAxes={'Q [m3/s]'} yAxes={'h [m]'}/>
                </div>
            )
        }

    }
}


// for displaying hydrogram charts
class Hydrogram extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: GlobalStorage.resultsTab.hydrogram.y,
            names: GlobalStorage.resultsTab.hydrogram.names
        }
    }

// display hydrogam if data exists
    plot() {
        let inputData = this.state.data;
        let names = this.state.names;

        if (inputData.length == names.length && inputData.length > 0) {
            return (
                <div>
                    <h3> Hydrogram </h3>
                    <LineChart y={inputData} x={'months'} name={names} />
                    <BarChart y={inputData} x={'months'} name={names} />
                </div>
            )
        }
        else {
            return (
                    <div className="data-not-imported">
                        <h2> Import data to see graphs </h2>
                    </div>
            )
        }
    }

    render() {
        return (
            <div>
                {this.plot()}
            </div>
        )
    }

}


export {ResultsView};