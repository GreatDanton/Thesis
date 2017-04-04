import React from 'react';
import ReactDOM from 'react-dom'

import GlobalStorage from '../scripts/globalStorage';
import {LineChart, BarChart, ScatterChart} from '../components/commonParts/charts.js';
import {createConsumptionCurve} from '../scripts/calculationHelpers';


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
        this.setState({
            HydrogramData: GlobalStorage.resultsTab.hydrogram.y,
            HydrogramNames: GlobalStorage.resultsTab.hydrogram.names
        });
    }

    render() {
        return (
            <div className="container-900">
               <Hydrogram data={this.state.HydrogramData} names={this.state.HydrogramNames} />
               <ConsumptionCurve />
               <EnergyProduction />
            </div>
        )
    }
}



class EnergyProduction extends React.Component {
    constructor(props) {
        super(props);
        this.consumptionCurve = GlobalStorage.channelTab.consumptionCurve;
        this.storage = GlobalStorage.HETAb;
        this.state = {
            Qmin: this.storage.Qmin,
            Qmax: this.storage.Qmax,
            H: this.storage.H,
            η:this.storage.η
        }
        // get consumption curve
    }

// TODO: Finish this
    calculatePower() {
        let consumptionCurve = GlobalStorage.channelTab.consumptionCurve;
        let averageData = GlobalStorage.resultsTab.hydrogram.y[2]; // flow

        for (let i of averageData) {
            let currentFlow = i;
            let Qmin;
            let Qmax;
            let Q_month;

            for (let j = 0; j < consumptionCurve.length; j++ ) {
                let Q_current = consumptionCurve[j];
                let Q_future = consumptionCurve[j+1];

// future Q does not exist => which means our monthly average flow is bigger than top of our consumption curve
// => water is spilling over channel ?
                if (Q_future === undefined) {
                    Qmax = currentFlow;
                    Q_month = currentFlow;
                    Qmin = Q_current;
                }
                else if (Q_current < currentFlow && Q_future < currentFlow) {
                    continue;
                }
                else if (Q_current < currentFlow && Q_future > currentFlow) {
                   Qmin = Q_current;
                   Qmax = Q_future;
                   Q_month = currentFlow;
                   break;
                }
// first flow bigger than average monthly flow -> probably something wrong with data
                else if (Q_current > currentFlow) {
                    console.log('current Q > averageMonthly flow -> probably something wrong with data, check resultsView script')
                    break;
                }

            }
            console.log(currentFlow);
        }
    }

    render() {
        return (
            <div className="data-not-imported">
                <h2> Add power plant parameters & flow data to see produced electricity </h2>
                {this.calculatePower()}
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
        let points = createConsumptionCurve(activeChannel);
        return points;
    }

    render() {
        let data = this.storage.consumptionCurve;

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
        this.plot = this.plot.bind(this);
    }

// display hydrogam if data exists
    plot() {
        let inputData = this.props.data;
        let names = this.props.names;

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
                        <h2> Import flow data to see graphs </h2>
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