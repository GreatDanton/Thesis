import React from 'react';

import GlobalStorage from '../scripts/globalStorage';
import {LineChart, BarChart, ScatterChart} from '../components/commonParts/charts.js';
import {getDailyFlow} from '../scripts/parseCsv';
import {createConsumptionCurve, downstreamRiverHeight, producedElectricity} from '../scripts/calculationHelpers';

import {Table} from '../components/commonParts/tables.js';

class ResultsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            HydrogramData: GlobalStorage.resultsTab.hydrogram.y,
            HydrogramNames: GlobalStorage.resultsTab.hydrogram.names
        };
    }

    // update hydrogram on rerender resultsView component
    componentWillReceiveProps() {
        this.setState({HydrogramData: GlobalStorage.resultsTab.hydrogram.y, HydrogramNames: GlobalStorage.resultsTab.hydrogram.names});
    }

    render() {
        return (
            <div className="container-900">
                <Hydrogram data={this.state.HydrogramData} names={this.state.HydrogramNames}/>
                <DurationCurve data={this.state.HydrogramData} names={this.state.HydrogramNames} />
                <ConsumptionCurve/>
                <EnergyProduction/>
            </div>
        )
    }
}

class EnergyProduction extends React.Component {
    constructor(props) {
        super(props);
        this.storage = GlobalStorage.HETAb;
        this.daysInMonth = GlobalStorage.daysInMonth;
        this.state = {
            Qmin: this.storage.Qmin,
            Qmax: this.storage.Qmax,
            H: this.storage.H,
            η: this.storage.η
        }
    }

    createTableData(ElectricityProduction) {
        // Electricity production => array of arrays suitable for graphs returns array
        // of arrays [Title, data,..., total]
        let totalProducedElectricity = 0;
        let tableData = ['Produced [MWh]'];
        for (let i of ElectricityProduction) {
            totalProducedElectricity += i;
            tableData.push(i);
        }
        totalProducedElectricity = totalProducedElectricity / 1000; // Total produced electricity in GWh
        tableData.push(totalProducedElectricity.toFixed(1));
        return [tableData];
    }

    render() {
        let ElectricityProduction = producedElectricity();

        // if powerarr does not exist -> render helper message
        if (ElectricityProduction === undefined) {
            return (
                <div className="data-not-imported">
                    <h2>
                        Add power plant parameters & flow data to see produced electricity
                    </h2>
                </div>
            )
        } else {
            let tableData = this.createTableData(ElectricityProduction);

            return (
                <div>
                    <h3 className="margin-u-40">
                        Average yearly electricity production
                    </h3>
                    <BarChart
                        y={[ElectricityProduction]}
                        x={'months'}
                        name={['Electricity production']}
                        xAxes={'Months'}
                        yAxes={'Produced [MWh]'}/>

                    <h3 className="margin-u-40">
                        Overview
                    </h3>

                    <div className="margin-b-40">
                    <Table
                        header={[
                        '',
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec',
                        ' Σ [GWh]'
                    ]}
                        data={tableData}/>
                    </div>
                </div>
            )
        }
    }
}

// create consumption curve out of active channel data
class ConsumptionCurve extends React.Component {
    constructor(props) {
        super(props);
        this.storage = GlobalStorage.channelTab;
        console.log(GlobalStorage);
    }

    plot() {
        let activeChannel = this.storage.active;
        let points = createConsumptionCurve(activeChannel);
        return points;
    }

    render() {
        let data = this.storage.consumptionCurve;

        if (data[0].length === 0) {
            return (
                <div className="data-not-imported">
                    <h2>
                        Add channel parameters to see consumption curve
                    </h2>
                </div>
            )
        } else {
            return (
                <div>
                    <h3 className="margin-u-40">
                        Consumption curve
                    </h3>
                    <ScatterChart
                        data={data}
                        name={["consumption curve"]}
                        smooth={'y'}
                        xAxes={'Q [m3/s]'}
                        yAxes={'h [m]'}/>
                </div>
            )
        }
    }
}



// displays duration curve in results tab - sorted Q(months) curve
class DurationCurve extends React.Component {
    constructor(props) {
        super(props);
        this.plot = this.plot.bind(this);
    }

    plot() {
        let inputData = this.props.data;

        if (inputData.length === 0) {
            return (
                <div className="data-not-imported">
                    <h2>
                        Import daily flow data to see duration curve
                    </h2>
                </div>
            )
        } else {
            // display graph
            let graphData = getDailyFlow(inputData);
            console.log(graphData);

            let sortedArr = [];
            for (let year of graphData) {
                let sortedYear = year.sort(function(a,b){
                    return b - a;
                });
                sortedArr.push(sortedYear);
            }
            console.log('sorted arr')
            console.log(sortedArr);

            return (
                <div>
                    <h3> Duration curve </h3>
                    <LineChart x={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']}
                        y={sortedArr}
                        name={this.props.names}
                        yAxes={'Q [m3/s]'}
                        xAxes={'Months'}
                        startWithZero={true}
                        LineTension={0.2}
                    />
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



// for displaying hydrogram charts
class Hydrogram extends React.Component {
    constructor(props) {
        super(props);
        this.plot = this
            .plot
            .bind(this);
    }

    // display hydrogam if data exists
    plot() {
        let inputData = this.props.data;
        let names = this.props.names;

        if (inputData.length == names.length && inputData.length > 0) {
            let graphData = getDailyFlow(inputData);

            return (
                <div>
                    <h3>
                        Hydrogram
                    </h3>
                    <LineChart y={graphData} x={'months'} name={names} yAxes={'Q [m3/s]'}/>
                    <div className="margin-u-40"/>
                    <BarChart y={graphData} x={'months'} name={names} yAxes={'Q [m3/s]'}/>
                </div>
            )
        } else {
            return (
                <div className="data-not-imported">
                    <h2>
                        Import daily flow data to see hydrogram
                    </h2>
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