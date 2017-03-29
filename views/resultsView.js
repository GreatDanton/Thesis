import React from 'react';

import {LineChart, BarChart} from '../components/commonParts/charts.js';
//import {createMonthlyFlow, getExtremeFlow, createGraphData, getAverageData} from '../scripts/parseCsv.js';
import GlobalStorage from '../scripts/globalStorage';


class ResultsView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        let inputData  = GlobalStorage.resultsTab.hydrogram.y;
        let names = GlobalStorage.resultsTab.hydrogram.names;

        return (
            <div>
            <div className="container-900">
                <div className="row">
                    <h2> ResultsView </h2>
                </div>
            </div>

            <div className="container-900">
                <LineChart y={inputData} x={'months'} name={names} />
                <BarChart y={inputData} x={'months'} name={names} />
            </div>
            </div>
        )
    }
}


export {ResultsView};