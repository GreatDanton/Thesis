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
                let points = storage.custom.points;
                let channelHeight = custom_getChannelHeight(points);
                let lowestPoint = custom_getLowestChannelPoint(points);

                for (let i = 0; i < points.length - 1; i++) {
                    let p1 = points[i];
                    let p2 = points[i+1];

                    custom_sectionFlow(p1, p2, channelHeight);
                }

                //console.log(channelHeight);
                //console.log(lowestPoint);
            }

            let pointsArray = [points];
            return pointsArray;
}


function custom_sectionFlow(point1, point2, channelHeight) {
    let H_starting = custom_getLowestChannelPoint([point1, point2]);
    let func = custom_getFunction(point1, point2);

    if (func['line'] === 'vertical') {
        // calculateForVertical
    } else {
        // calculate for diagonal
    }
    let k = func.k;
    let n = func.n;

    // for loop from H_starting to channelHeight to calculate S and P of section

    console.log('k: ' + k);
    console.log('n: ' + n);
}


// calculates P & S for each height for vertical linear function
function custom_verticalFunction(point1, point2, channelHeight) {
    let dY = Math.abs(point1.y - point2.y);
    let startingPoint;
    if (point1.y >= point2.y) {
        startingPoint = point1.y;
    } else {
        startingPoint = point2.y;
    }

    let pointsArr = [];
    for (let i = 0; i < dY; i+=0.01) {
        let h = startingPoint + i;
        let S = 0;
        let P = i;
        let point = {[h]: {'S': S, 'P': P}}
        pointsArr.push(point);
    }
    return pointsArr;
}

function custom_getFunction(point1, point2) {
    // y = k*x + n;
    let dY = point2.y - point1.y;
    let dX = point2.x - point1.x;
    let k;
    let n;

   if (dX === 0) { // straight vertical line
        return {
            'line': 'vertical',
            'x': point2.x
        }
    }

    k = dY / dX;
    n = point2.y - k * point2.x;
    return {
        'line': 'diagonal',
        'k': k,
        'n': n
    }
}


// get maximum height of channel (lowest point of side points)
// input: pointsArr (from GlobalStorage)
// returns: max height of channel (float);
function custom_getChannelHeight(pointsArr) {
    let start = pointsArr[0].y;
    let end = pointsArr[pointsArr.length - 1].y;
    if (start <= end) {
        return start;
    } else {
        return end;
    }
}


// input = PointsArray (from GlobalStorage)
// returns lowest point of channel
function custom_getLowestChannelPoint(pointsArr) {
    let height = pointsArr[0].y;
    for (let point of pointsArr) {
        if (point.y < height) {
            height = point.y;
        }
    }
    return height;
}


function customConsumptionCurve() {
    let pointsObj = GlobalStorage.channelTab.custom.points;
    let ngObj = GlobalStorage.channelTab.custom.ngInputs;
    // algorithm for flow calculation
    console.log(pointsObj);
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
export function producedElectricity() {
    let consumptionCurve = GlobalStorage.channelTab.consumptionCurve;
    let averageData = GlobalStorage.resultsTab.hydrogram.y[2]; // flow
    let daysInMonth = GlobalStorage.daysInMonth;

    let storage = GlobalStorage.HETAb;
    let Qmin = parseFloat(storage.Qmin);
    let Qmax = parseFloat(storage.Qmax);
    let Qmax_teh = storage.Qteh;
    let H = storage.H;
    let efficiency = storage.η / 100;

    let Q;
    let NO_ENERGY_PRODUCED = -1;
    let CHANNEL_OVERFLOW = -2
    let PowerArr = [];

    // if data does not exist
    if (averageData === undefined) {
        return;
    }

    for (let i = 0; i < averageData.length; i++) {
        // average daily river flow
        let riverFlow = parseFloat(averageData[i]) / daysInMonth[i];

        if (riverFlow > Qmax_teh) { // if flow is bigger than technical maximum of power plant, produced energy == 0;
            Q = 0;
        } else if (riverFlow < Qmin) { // if flow is smaller than technical minimum, produced energy == 0;
            Q = 0;
        } else if (riverFlow > Qmin && riverFlow < Qmax) { // if flow is in between min and max
            Q = riverFlow;
        } else if (riverFlow > Qmax) { // if flow is bigger than maximum flow through turbine, flow == technical maximum
            Q = Qmax;
        }

        let H_downstream = downstreamRiverHeight(Q);
        if (H_downstream == NO_ENERGY_PRODUCED) {
            H_downstream = H;
            console.log('flow to small to produce energy');
        } else if (H_downstream == CHANNEL_OVERFLOW) {
            // height of the downstream river is the same as height of the channel
            H_downstream = consumptionCurve[consumptionCurve.length - 1].y;
            console.log('channel is overflowing');
        }

        let hBruto = H - H_downstream; // average hBruto per day for this month
        let power = efficiency * 9.81 * Q * hBruto; // in [kW] per day for this month

        let monthlyElectricity = power * daysInMonth[i] * 24 / 1000;  // MWh per month
        monthlyElectricity = parseFloat(monthlyElectricity.toFixed(1));
        PowerArr.push(monthlyElectricity);
    }

    return PowerArr;
}