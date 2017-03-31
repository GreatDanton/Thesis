
// calculate shape properties (area and circumference)
// rectangle, trapezoid, custom
function rectangle_area(b, h) {
    return b * h;
}

function rectangle_circumference(b, h) {
    return (2 * h + b);
}

function trapezoid_area(b, h, angle) {
    let x = h / Math.tan(angle);
    return ( b * h + x * h);
}

function trapezoid_circumference(b, h, angle) {
    let x = h / Math.tan(angle);
    let sides = (x**2 + h**2)**(1/2);
    return (b + 2*sides);
}

// calculates water flow [m3/s]
// area [m2]
// circumference [m]
// angle [%]
// ng [/]
function ManningEquation(area, circumference, ng, angle) {
   let flow = 1/ng * (angle/100)**(1/2) * (area / circumference)**(2/3) * area;
    return flow;
}

export {
    rectangle_area,
    rectangle_circumference,
    trapezoid_area,
    trapezoid_circumference,
    ManningEquation
}

// TODO add custom channel functions