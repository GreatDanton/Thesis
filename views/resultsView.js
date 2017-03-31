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
        let area;
        let circumference;
        let points = [];

        if (activeChannel == 'Rectangular') {
            let h = parseFloat(this.storage.rectangular.h);
            let b = parseFloat(this.storage.rectangular.B);
            let ng = parseFloat(this.storage.rectangular.ng);
            let angle = parseFloat(this.storage.rectangular.φ);

            for (let i = 0; i < h; i += 0.01) {
                let area = rectangle_area(b, i);
                let circumference = rectangle_circumference(b, i);
                let Q = ManningEquation(area, circumference, ng, angle);

                points.push({'x': Q, 'y': i});
            }
        } else if (activeChannel == 'Trapezoid') {
            let h = this.storage.trapezoid.h;
            let b = this.storage.trapezoid.B;

            let areaFunc = trapezoid_area;
            let circFunc = trapezoid_circumference;
        } else if (activeChannel == 'Custom') {
            console.log('custom');
            console.log('custom');
        }

        let pointsArray = [points];
        return pointsArray;
    }

    render() {
        let data = this.plot();
        console.log(data);
        if (data.length == 0) {
            return (
                <div className="data-not-imported">
                    <h2>  Add channel parameters to see consumption curve </h2>
                </div>
            )
        } else {
            return (
                <div>
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