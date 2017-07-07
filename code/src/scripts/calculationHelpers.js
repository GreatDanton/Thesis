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
                let _x = (B - b) / 2;
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
                let channelPoints = storage.custom.points;
                let channelHeight = custom_getChannelHeight(channelPoints);
                //let channelParameters_sum = {};
                let partlyFlows = [];

                // iterate over points array
                for (let i = 0; i < channelPoints.length - 1; i++) {
                    let p1 = channelPoints[i];
                    let p2 = channelPoints[i+1];

                    let channelParameters = custom_sectionParameters(p1, p2, channelHeight);

                    // ng and I for each section of the channel (between two points)
                    let ng = storage.custom.ngInputs[i];
                    let I = storage.custom.φ_inputs[i];

                    // for each section of the channel create object {river_height: river_flow};
                    let partSectionFlow = createHeightFlowObject(channelParameters, ng, I);
                    partlyFlows.push(partSectionFlow);
                }

                points = custom_createPoints(partlyFlows);
            }

            let pointsArray = [points];
            return pointsArray;
}

// create {river_height: flow} object for each part of the channel
// (between two points ==> section)
// returns: {river_height: flow} object
function createHeightFlowObject(channelParameters, ng, I) {
    let heightFlow = {};
    for (let i in channelParameters) {
        let obj = channelParameters[i];
        let riverHeight = Object.keys(obj);
        let values = obj[riverHeight];

        let S = values.S;
        let P = values.P;
        let Q;
        // when p is zero manning equations returns infinite => fix it with Q = 0
        if (P === 0) {
            Q = 0;
        } else {
            Q = ManningEquation(S, P, ng, I);
        }
        heightFlow[riverHeight] = Q;
    }
    return heightFlow;
}



// returns [x: Q, y: h]
function custom_createPoints(partlyFlowsArr) {
    console.log('Custom points');
    let sum_heightFlows = {};

    for (let i of partlyFlowsArr) {
        sum_heightFlows = sum_objects(i, sum_heightFlows);
    }
    console.log(sum_heightFlows);

    let heights = Object.keys(sum_heightFlows).sort();
    let points = [];

    for (let height of heights) {
        let Q = sum_heightFlows[height];
        height = parseFloat(height);
        let point = {'x': Q, 'y': height};
        points.push(point);
    }
    return points;
}

// for each key in input object check if it exist in sumObject
// if it does: sum P and S
// else add key and values
function sum_objects(inputObjectArray, sumObject) {
    let heights = Object.keys(inputObjectArray);

    for (let i of heights) {
        let height = i;
        if (sumObject.hasOwnProperty(i)) {
            sumObject[height] += inputObjectArray[height];
        } else {
            sumObject[height] = inputObjectArray[height];
        }
    }
    return sumObject;
}

// calculates P and S for each section (between two points)
// input: starting, ending point
// output: P & S for section on cm of water height
function custom_sectionParameters(point1, point2, channelHeight) {
    let H_starting = custom_getLowestChannelPoint([point1, point2]);
    let func = custom_getFunction(point1, point2);
    let points;

    if (func.line === 'vertical') {
        // calculate for vertical function
        points = custom_verticalFunction(point1, point2, channelHeight);
    } else {
        // calculate for diagonal or horizontal function
        points = custom_diagonalFunction(point1, point2, func, channelHeight);
    }

    return points;
}


// calculates P & S for each height for vertical linear function
function custom_verticalFunction(point1, point2, channelHeight) {
    let dY = Math.abs(point1.y - point2.y);
    let startingPoint;
    if (point1.y >= point2.y) {
        startingPoint = point2.y;
    } else {
        startingPoint = point1.y;
    }

    let pointsArr = [];
    for (let i = 0; i < dY; i+=0.01) {
        let h = startingPoint + i;
        let S = 0;
        let P = i;
        let point = {[h.toFixed(2)]: {'S': S, 'P': P}};
        pointsArr.push(point);
    }
    return pointsArr;
}


// calculates P & S for each height for diagonal or horizontal function
function custom_diagonalFunction(point1, point2, func, channelHeight) {
    let k = func.k;
    let n = func.n;

    let pointsArr = [];
    if (k === 0) { // if function is horizontal
        let dY = channelHeight - point2.y;
        let dX = point1.x - point2.x;

        for (let i = 0; i < dY; i += 0.01) {
            let h = point2.y + i;
            let P = Math.abs(dX);
            let S = Math.abs(dX * i);

            let point =  {[h.toFixed(2)]: {'P': P, 'S': S}};
            pointsArr.push(point);
        }
    } else { // if function is diagonal;
        let startingPoint = custom_getLowestChannelPoint([point1, point2]);
        let lowerPoint = custom_getLowerPoint(point1, point2);

        let delta_pointY = Math.abs(point1.y - point2.y);

        // river height = height
        for (let height = startingPoint; height < channelHeight; height += 0.01) {
            let triangularSection = startingPoint + delta_pointY;

            // if water is in triangular section;
            if (height <= triangularSection) {
                let slopePoint = custom_getSlopePoint(func, height);
                let P = custom_pointsDistance(lowerPoint, slopePoint);
                let S = custom_calculateTriangleArea(slopePoint, lowerPoint);

                let point = {[height.toFixed(2)]: {'P': P, 'S': S}};
                pointsArr.push(point);

            } else { // if water is above triangular section
                // calculate P from point1, point2;
                // calculate S = Triangle S  +  Rectangle S
                let P = custom_pointsDistance(point1, point2);
                let S_triangle = custom_calculateTriangleArea(point1, point2);
                let dX = Math.abs(point1.x - point2.x);
                let S_square = dX * (height - triangularSection);
                let S = S_triangle + S_square;

                let point = {[height.toFixed(2)]: {'S': S, 'P': P}};
                pointsArr.push(point);
            }
        }
    }

    return pointsArr;
}


function custom_calculateTriangleArea(point1, point2) {
    let dX  = Math.abs(point1.x - point2.x);
    let dY = Math.abs(point1.y - point2.y);
    let area = dX * dY / 2;

    return area;
}

// get lower point of two input points;
function custom_getLowerPoint(point1, point2) {
    if (point1.y < point2.y) {
        return point1;
    }
    return point2;
}

function custom_pointsDistance(point1, point2) {
    let dY = Math.abs(point1.y - point2.y);
    let dX = Math.abs(point1.x - point2.x);
    let distance = (dY**2 + dX**2)**(1/2);
    return distance;
}

// Get point coordinates on the slope of the input function
// input: function {k, n}; height => y on function
// returns: point {x, y} on the function
function custom_getSlopePoint(func, height) {
    let k = func.k;
    let n = func.n;
    let y = height;
    // y = kx + n; ==> x
    let x = (y - n) / k;
    let point = {'x': x, 'y': y};
    return point;
}


// creates linear function between two given points
function custom_getFunction(point1, point2) {
    // y = k*x + n;
    let dY = point2.y - point1.y;
    let dX = point2.x - point1.x;
    let k;
    let n;

   if (dX === 0) { // straight vertical line
        return {
            'line': 'vertical',
        };
    }

    k = dY / dX;
    n = point2.y - k * point2.x;
    return {
        'line': 'diagonal',
        'k': k,
        'n': n,
    };
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

        if (turbineFlow === 0) {
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
    let CHANNEL_OVERFLOW = -2;
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