
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
    let sides = (x**2 + h**2)**(1/2)
    return (b + 2*sides);
}


// TODO add custom channel functions