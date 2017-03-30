import React from 'react';

import {LineChart, BarChart} from '../components/commonParts/charts.js';
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
            </div>
        )
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
                    <h2> Import data too see graphs </h2>
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