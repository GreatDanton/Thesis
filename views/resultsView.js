import React from 'react';

import {LineChart, BarChart} from '../components/commonParts/charts.js';
import {createMonthlyFlow, getExtremeFlow, createGraphData, getAverageData} from '../scripts/parseCsv.js';


class ResultsView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        // TODO: delete this later, leaving it here just for test
        let sample_csv = `
        1.1.2010,50.00
        2.1.2010,55.0
        3.1.2010,60.0
        4.1.2010,75.5
        5.1.2010,50.25
        1.2.2010,10.25
        1.1.2011,5
        5.3.2011,10
        1.4.2011,10
        2.5.2012,4
        `
        let waterFlow = createMonthlyFlow(sample_csv);
        let graphData = createGraphData(2010, waterFlow);
        let inputData = [];
        let data2 = [200, 50, 100, 50, 0, 100, 300, 0, -40, 30, 80, 100];
        inputData.push(graphData);
        inputData.push(data2);

        return (
            <div>
            <div className="container-900">
                <div className="row">
                    <h2> ResultsView </h2>
                </div>
            </div>

            <div className="container-900">
                <LineChart y={inputData} x={'months'} name={["2010", "custom"]} />
                <BarChart y={inputData} x={'months'} name={["2010", "custom"]} />
            </div>
            </div>
        )
    }
}


export {ResultsView};