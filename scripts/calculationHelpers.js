import GlobalStorage from './globalStorage';
import {rectangle_area, rectangle_circumference, trapezoid_area, trapezoid_circumference, ManningEquation} from './shapeProperties';


// parameters:
// activeChannel: currently active channel (get it from GlobalStorage)
// returns: [[{x1,y1}, {x2,y2}]]  => where x=flow, y=height
// points in array of arrays for displaying in ScatterPlot

export function createConsumptionCurve(activeChannel) {
    let storage = GlobalStorage.channelTab;
    let points = [];

    if (activeChannel == 'Rectangular') {
                let h = parseFloat(storage.rectangular.h);
                let b = parseFloat(storage.rectangular.B);
                let ng = parseFloat(storage.rectangular.ng);
                let angle = parseFloat(storage.rectangular.φ);

                for (let i = 0; i < h; i += 0.01) {
                    let area = rectangle_area(b, i);
                    let circumference = rectangle_circumference(b, i);
                    let Q = ManningEquation(area, circumference, ng, angle).toFixed(2);
                    Q = parseFloat(Q);
                    let Y = i.toFixed(2);
                    Y = parseFloat(Y);
                    points.push({'x': Q, 'y': Y});
                }
            } else if (activeChannel == 'Trapezoid') {
                let h = parseFloat(storage.trapezoid.h);
                let b = parseFloat(storage.trapezoid.b);
                let B = parseFloat(storage.trapezoid.B);
                let ng = parseFloat(storage.trapezoid.ng);
                let channelAngle = parseFloat(storage.trapezoid.φ);
                // calculate angle of sides
                let _x = (B - b) / 2
                let beta = (Math.atan(h / _x)) * 180 / Math.PI;

                for (let i = 0; i < h; i += 0.01) {
                    let area = trapezoid_area(b, i, beta);
                    let circumference = trapezoid_circumference(b, h, beta);
                    let Q = ManningEquation(area, circumference, ng, channelAngle).toFixed(2);
                    Q = parseFloat(Q);
                    let Y = i.toFixed(2);
                    Y = parseFloat(Y);
                    points.push({'x': Q, 'y': Y});
                }
            } else if (activeChannel == 'Custom') {
                console.log('custom');
            }

            let pointsArray = [points];
            return pointsArray;
}


// TODO: finish this;
// return -1 if there is not energy produced
export function downstreamRiverHeight(turbineFlow) {
    let consumptionCurve = GlobalStorage.channelTab.consumptionCurve[0];
    let Q_bigger;
    let h_bigger;
    let Q_smaller;
    let h_smaller;
    let h_downstream;

    // if consumption curve does not exist, return
    if (consumptionCurve === undefined) {
        return;
    }

    let Q_channelMax = consumptionCurve[consumptionCurve.length-1].x;

    for (let i = 0; i < consumptionCurve.length; i++) {
        let flowOnConsumptionCurve = consumptionCurve[i].x;

        if (turbineFlow == 0) {
            return -1; // no energy produced
        }
        else if (turbineFlow > Q_channelMax) { // water is overflowing channel -> notify
            return -2;
        }
        else if (turbineFlow < flowOnConsumptionCurve) { // there is still some height left untill the top of the channel
            Q_bigger = flowOnConsumptionCurve;
            h_bigger = consumptionCurve[i].y;
            Q_smaller = consumptionCurve[i-1].x;
            h_smaller = consumptionCurve[i-1].y;

            // calculate downstream height
            let h_downstream = interpolateHeight(Q_bigger, h_bigger, Q_smaller, h_smaller, turbineFlow);
            return h_downstream;
        }
    }
}


// get downstream height via => dQ : dh = Q_diff : h_diff
// returns downstream river height in channel
function interpolateHeight(Q_bigger, h_bigger, Q_smaller, h_smaller, turbineFlow) {
        let dQ = Q_bigger - Q_smaller;
        let dh = h_bigger - h_smaller;
        let Q_diff = turbineFlow - Q_smaller;
        let h_diff = dh * Q_diff / dQ;

        let h_downstream = parseFloat((h_diff + h_smaller).toFixed(2));
        return h_downstream;
}


// calculates produced power
// returns array of power [kW] for each month in average year
export function producedPower() {
    let consumptionCurve = GlobalStorage.channelTab.consumptionCurve;
    let averageData = GlobalStorage.resultsTab.hydrogram.y[2]; // flow
    let daysInMonth = GlobalStorage.daysInMonth;

    let storage = GlobalStorage.HETAb;
    let Qmin = parseFloat(storage.Qmin);
    let Qmax = parseFloat(storage.Qmax);
    let Qmax_teh = 1000;
    let H = storage.H;
    let efficiency = storage.η

    let Q;
    let NO_ENERGY_PRODUCED = -1;
    let CHANNEL_OVERFLOW = -2
    let PowerArr = [];

    // if data does not exist
    if (averageData === undefined) {
        return;
    }

    for (let i = 0; i < averageData.length; i++) {
        // average monthly river flow
        let riverFlow = parseFloat(averageData[i]) / daysInMonth[i];

        if (riverFlow > Qmax_teh) { // if flow is bigger than technical maximum of power plant, produced energy == 0;
            Q = 0;
        } else if (riverFlow < Qmin) { // if flow is smaller than technical minimum, produced energy == 0;
            Q = 0;
        } else if (riverFlow > Qmin && riverFlow < Qmax) { // if flow is in between min and max
            Q = riverFlow;
        } else if (riverFlow > Qmax) { // if flow is bigger than technical maximum, flow == technical maximum
            Q = Qmax;
        }

        let H_downstream = downstreamRiverHeight(Q);
        if (H_downstream == NO_ENERGY_PRODUCED) {
            H_downstream = H;
            console.log('flow to small to produce energy');
        } else if (H_downstream == CHANNEL_OVERFLOW) { // TODO finish this -> What to do if the channel is overflowing?
            H_downstream = H;
            console.log('channel is overflowing');
        }

        let hBruto = H - H_downstream;
        let power = efficiency * 9.81 * Q * hBruto / 1000; // in [kW]
        PowerArr.push(power);
    }

    return PowerArr;
}