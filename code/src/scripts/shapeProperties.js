
// calculate shape properties (area and circumference)
// rectangle, trapezoid, custom
function rectangle_area(b, h) {
    return b * h;
}

function rectangle_circumference(b, h) {
    return (2 * h + b);
}

function trapezoid_area(b, h, beta) {
    b = parseFloat(b);
    h = parseFloat(h);
    beta = parseFloat(beta) * Math.PI / 180; // beta should be in radians
    let x = h / (Math.tan(beta)); // beta in radians
    let area = b * h + x * h;
    return area;
}

function trapezoid_circumference(b, h, beta) {
    b = parseFloat(b);
    h = parseFloat(h);
    beta = parseFloat(beta) * Math.PI / 180; // beta should be in radians

    let x = h / (Math.tan(beta));
    let sides = (x ** 2 + h ** 2) ** (1 / 2);
    let P = b + 2 * sides;
    return P;
}

// calculates water flow [m3/s]
// area [m2]
// circumference [m]
// angle [%]
// ng [/]
function ManningEquation(area, circumference, ng, channelAngle) {
    area = parseFloat(area);
    circumference = parseFloat(circumference);
    ng = parseFloat(ng);
    channelAngle = parseFloat(channelAngle);
    let flow = 1 / ng * (channelAngle / 100) ** (1 / 2) * (area / circumference) ** (2 / 3) * area;
    return flow;
}

export {
    rectangle_area,
    rectangle_circumference,
    trapezoid_area,
    trapezoid_circumference,
    ManningEquation
}