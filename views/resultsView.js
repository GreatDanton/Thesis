import React from 'react';
import ReactDOM from 'react-dom'

import GlobalStorage from '../scripts/globalStorage';
import {LineChart, BarChart, ScatterChart} from '../components/commonParts/charts.js';
import {getDailyFlow} from '../scripts/parseCsv'
import {createConsumptionCurve, downstreamRiverHeight, producedPower} from '../scripts/calculationHelpers';

class ResultsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            HydrogramData: GlobalStorage.resultsTab.hydrogram.y,
            HydrogramNames: GlobalStorage.resultsTab.hydrogram.names
        }
    }

    // update hydrogram on rerender resultsView component
    componentWillReceiveProps() {
        this.setState({HydrogramData: GlobalStorage.resultsTab.hydrogram.y, HydrogramNames: GlobalStorage.resultsTab.hydrogram.names});
    }

    render() {
        return (
            <div className="container-900">
                <Hydrogram data={this.state.HydrogramData} names={this.state.HydrogramNames}/>
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


    render() {
        let PowerArr = producedPower();

        // if powerarr does not exist -> render helper message
        if (PowerArr === undefined) {
            return (
                <div className="data-not-imported">
                    <h2> Add power plant parameters & flow data to see produced electricity </h2>
                </div>
            )
        } else {
            let ElectricityProduction = PowerArr.map((monthlyPower,index) => {
                let producedElectricity = monthlyPower * this.daysInMonth[index] * 24 / 1000;
                return parseFloat(producedElectricity.toFixed(1));
            });
            console.log(ElectricityProduction);

            return (
                <div>
                    <h2> Average Production </h2>
                    <BarChart y={[ElectricityProduction]} x={'months'} name={['Power production']} xAxes={'Months'} yAxes={'Produced [MWh]'}/>
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
                    <h3>
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


// for displaying hydrogram charts
class Hydrogram extends React.Component {
    constructor(props) {
        super(props);
        this.plot = this.plot.bind(this);
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
                    <LineChart y={graphData} x={'months'} name={names}/>
                    <BarChart y={graphData} x={'months'} name={names}/>
                </div>
            )
        } else {
            return (
                <div className="data-not-imported">
                    <h2>
                        Import flow data to see graphs
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