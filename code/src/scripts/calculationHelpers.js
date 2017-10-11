import GlobalStorage from './globalStorage';
import { rectangle_area, rectangle_circumference, trapezoid_area, trapezoid_circumference, ManningEquation } from './shapeProperties';


// parameters:
// activeChannel: currently active channel (get it from GlobalStorage)
// returns: [[{x1,y1}, {x2,y2}]]  => where x=flow, y=height
// points in array of arrays for displaying in ScatterPlot

export function createConsumptionCurve(activeChannel) {
    let storage = GlobalStorage.channelTab;
    let points = [];

    if (activeChannel === 'Rectangular') {
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
            points.push({ 'x': Q, 'y': Y });
        }
    } else if (activeChannel === 'Trapezoid') {
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
            let circumference = trapezoid_circumference(b, i, beta);
            let Q = ManningEquation(area, circumference, ng, channelAngle).toFixed(2);
            Q = parseFloat(Q);
            let Y = i.toFixed(2);
            Y = parseFloat(Y);
            points.push({ 'x': Q, 'y': Y });
        }
    } else if (activeChannel === 'Custom') {
        let channelPoints = storage.custom.points;
        let channelHeight = custom_getChannelHeight(channelPoints);
        let ng = parseFloat(storage.custom.ng);
        let angle = parseFloat(storage.custom.φ);

        let channelPartParameters = [];

        // iterate over points array
        for (let i = 0; i < channelPoints.length - 1; i++) {
            let p1 = channelPoints[i];
            let p2 = channelPoints[i + 1];

            let channelPartParams = custom_sectionParameters(p1, p2, channelHeight);
            // ng and I for each section of the channel (between two points)
            let ng = storage.custom.ng;
            let I = storage.custom.φ;
            channelPartParameters.push([channelPartParams, ng, I]);
        }

        let riverParams = sumChannelParameters(channelPartParameters);
        let riverFlow = createHeightFlowObject(riverParams, ng, angle);
        points = custom_createPoints(riverFlow);
    }

    let pointsArray = [points];
    return pointsArray;
}

// create {river_height: flow} object for each part of the channel
// (between two points ==> section)
// returns: {river_height: flow} object
function createHeightFlowObject(channelParameters, ng, I) {
    let heightFlow = {};
    let riverHeightsArr = Object.keys(channelParameters);

    for (let riverHeight of riverHeightsArr) {
        let values = channelParameters[riverHeight];
        let S = values.S;
        let P = values.P;
        let Q;
        // when p is zero manning equations returns infinite => fix it with Q = 0
        if (P === 0) {
            Q = 0;
        } else {
            Q = ManningEquation(S, P, ng, I);
        }
        Q = parseFloat(Q.toFixed(2));
        heightFlow[riverHeight] = Q;
    }
    return heightFlow;
}

// sum S and P together from array of channel parts
// channelParametersArr = [[h: {S, P}], ng , I]
//
// return {height: {P, S}} of the whole array
// used to build data for river flow through custom channel
function sumChannelParameters(channelParametersArr) {
    let channelParameters = {};

    for (let i of channelParametersArr) {
        let heightParamsArray = i[0]; // {height = {S, P}}
        for (let obj of heightParamsArray) {
            let height = Object.keys(obj)[0]; // we have only one key in object
            let values = obj[height];
            let S = values.S;
            let P = values.P;

            if (channelParameters.hasOwnProperty(height)) {
                channelParameters[height]["S"] += S;
                channelParameters[height]["P"] += P;
            } else {
                channelParameters[height] = {};
                channelParameters[height]["S"] = S;
                channelParameters[height]["P"] = P;
            }
        }
    }
    return channelParameters;
}



// returns [x: Q, y: h]
function custom_createPoints(riverFlow) {
    // turn strings(heights) into floats so we can sort them later
    let heights = Object.keys(riverFlow);
    heights = heights.map(function (item) {
        return parseFloat(item);
    });
    // sort heights in ascending order
    heights.sort(function (a, b) {
        return a - b;
    });

    let points = [];

    // calculate height(flow)
    for (let height of heights) {
        height = height.toFixed(2);
        let Q = riverFlow[height.toString()];
        height = parseFloat(height);
        let point = { 'x': Q, 'y': height };
        points.push(point);
    }
    return points;
}

// calculates P and S for each section (between two points)
// input: starting, ending point
// output: P & S for section on cm of water height
function custom_sectionParameters(point1, point2, channelHeight) {
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
    for (let i = 0; i < dY; i += 0.01) {
        let h = startingPoint + i;
        let S = 0;
        let P = i;
        let point = { [h.toFixed(2)]: { 'S': S, 'P': P } };
        pointsArr.push(point);
    }
    return pointsArr;
}


// calculates P & S for each height for diagonal or horizontal function
function custom_diagonalFunction(point1, point2, func, channelHeight) {
    let k = func.k;
    //let n = func.n;

    let pointsArr = [];
    if (k === 0) { // if function is horizontal
        let dY = channelHeight - point2.y;
        let dX = point1.x - point2.x;

        for (let i = 0; i < dY; i += 0.01) {
            let h = point2.y + i;
            let P = Math.abs(dX);
            let S = Math.abs(dX * i);

            let point = { [h.toFixed(2)]: { 'P': P, 'S': S } };
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
            if (height < triangularSection) {
                let slopePoint = custom_getSlopePoint(func, height);
                let P = custom_pointsDistance(lowerPoint, slopePoint);
                let S = custom_calculateTriangleArea(slopePoint, lowerPoint);

                let point = { [height.toFixed(2)]: { 'P': P, 'S': S } };
                pointsArr.push(point);

            } else { // if water is above triangular section
                // calculate P from point1, point2;
                // calculate S = Triangle S  +  Rectangle S
                let P = custom_pointsDistance(point1, point2);
                let S_triangle = custom_calculateTriangleArea(point1, point2);
                let dX = Math.abs(point1.x - point2.x);
                let S_square = dX * (height - triangularSection);
                let S = S_triangle + S_square;

                let point = { [height.toFixed(2)]: { 'S': S, 'P': P } };
                pointsArr.push(point);
            }
        }
    }

    return pointsArr;
}


function custom_calculateTriangleArea(point1, point2) {
    let dX = Math.abs(point1.x - point2.x);
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
    let distance = (dY ** 2 + dX ** 2) ** (1 / 2);
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
    let point = { 'x': x, 'y': y };
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

    // if consumption curve does not exist, return
    if (consumptionCurve === undefined) {
        return;
    }

    let Q_channelMax = consumptionCurve[consumptionCurve.length - 1].x;

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
            Q_smaller = consumptionCurve[i - 1].x;
            h_smaller = consumptionCurve[i - 1].y;

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
    let consumptionCurve = GlobalStorage.channelTab.consumptionCurve[0];
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


    // calculate average daily power [m3/s] for each month of the average year
    for (let i = 0; i < averageData.length; i++) {
        let riverFlow = parseFloat(averageData[i]) / daysInMonth[i]; // daily river flow in each month

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
        if (H_downstream === NO_ENERGY_PRODUCED) {
            H_downstream = H;
            console.log('flow to small to produce energy');
        } else if (H_downstream === CHANNEL_OVERFLOW) {
            // height of the downstream river is the same as height of the channel
            let lastChannelParameter = consumptionCurve[consumptionCurve.length - 1];
            H_downstream = lastChannelParameter.y;
            // correct flow through turbine so the channel will not overflow
            Q = lastChannelParameter.x;

            if (Q > Qmax_teh) {
                Q = 0;
            } else if (Q > Qmax) {
                Q = Qmax;
            } else if (Q < Qmin) {
                Q = 0;
            }

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