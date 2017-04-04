import GlobalStorage from './globalStorage';
import {rectangle_area, rectangle_circumference, trapezoid_area, trapezoid_circumference, ManningEquation} from './shapeProperties';


// parameters:
// activeChannel: currently active channel (get it from GlobalStorage)
// returns: [[{x1,y1}, {x2,y2}]]  => where x=flow, y=height
// points in array of arrays for displaying in ScatterPlot

export function createConsumptionCurve(activeChannel) {
    let storage = GlobalStorage.channelTab;
    console.log(storage);
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
                    let Y = i.toFixed(2);
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
                    let Y = i.toFixed(2);
                    points.push({'x': Q, 'y': Y});
                }
            } else if (activeChannel == 'Custom') {
                console.log('custom');
            }

            let pointsArray = [points];
            return pointsArray;
}