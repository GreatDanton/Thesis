import React from 'react';

import {LineChart, BarChart} from '../components/commonParts/charts.js';
//import {createMonthlyFlow, getExtremeFlow, createGraphData, getAverageData} from '../scripts/parseCsv.js';
import GlobalStorage from '../scripts/globalStorage';


class ResultsView extends React.Component {
    constructor(props) {
        super(props);
    }

// display hydrogam if data exists
    hydrogram() {
        let inputData  = GlobalStorage.resultsTab.hydrogram.y;
        let names = GlobalStorage.resultsTab.hydrogram.names;

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
            <div className="container-900">
               {this.hydrogram()}
            </div>
        )
    }
}


export {ResultsView};