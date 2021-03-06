import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
// line chart example

// variables
const COLORS = [
    ['rgba(54,162,235,1)', 'rgba(54,162,235,0.2)'],
    ['rgba(255,99,132,1)', 'rgba(255,99,132,0.2)'],
    ['rgba(75,193,193,1)', 'rgba(75,193,193,0.2)'],
    ['rgba(255,206,86,1)', 'rgba(255,99,132,0.2)']
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];


// Create line chart via props
// y=[[1,2,3,4], [more,data,..,..]] x=["label1", "label2"]
class LineChart extends React.Component {
    constructor(props) {
        super(props);
        this.buildData = this.buildData.bind(this);
        this.colors = COLORS;
    }

    buildData() {
        let LineTension = 0.4;
        if (this.props.LineTension) {
            LineTension = this.props.LineTension;
        }

        let dataset = this.props.y.map((data, index) => {
            return (
                {
                    label: this.props.name[index],
                    fill: false,
                    lineTension: LineTension,
                    backgroundColor: this.colors[index][0],
                    borderColor: this.colors[index][0],
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: this.colors[index][0],
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: this.colors[index][0],
                    pointHoverBorderColor: 'rgba(0,0,0,0)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 4,
                    pointHitRadius: 10,
                    data: data
                }
            )
        });

        let X;
        if (this.props.x === 'months') {
            X = MONTHS;
        } else {
            X = this.props.x;
        }

        let finalData = {
            labels: X,
            datasets: dataset
        }

        return finalData;
    }

    render() {

        let yAxes = "";
        if (this.props.yAxes) {
            yAxes = this.props.yAxes;
        }

        let xAxes = "";
        if (this.props.xAxes) {
            xAxes = this.props.xAxes;
        }

        let startWithZero = true;
        if (this.props.startWithZero) {
            startWithZero = this.props.startWithZero;
        }

        let options = {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: xAxes
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: yAxes
                    },
                    ticks: {
                        beginAtZero: startWithZero
                    }
                }]
            }
        }


        let dataset = this.buildData;
        return (
            <div>
                <Line data={dataset} options={options} />
            </div>
        )
    }
}



// Create bar chart via props
// data=[[1,2,3,4], [3,4,5,6]], name=["name1", "name2"]
class BarChart extends React.Component {
    constructor(props) {
        super(props);
        this.buildData = this.buildData.bind(this);
        this.colors = COLORS;
    }

    buildData() {
        let dataset = this.props.y.map((data, index) => {
            return (
                {
                    label: this.props.name[index],
                    backgroundColor: this.colors[index][1],
                    borderColor: this.colors[index][0],
                    borderWidth: 1,
                    hoverBackgroundColor: this.colors[index][0],
                    hoverBorderColor: this.colors[index][0],
                    data: data
                }
            )
        });

        let X;
        if (this.props.x === 'months') {
            X = MONTHS;
        } else {
            X = this.props.x;
        }

        let finalData = {
            labels: X,
            datasets: dataset
        }

        return finalData;
    }

    render() {

        let yAxes = "";
        if (this.props.yAxes) {
            yAxes = this.props.yAxes;
        }

        let xAxes = "";
        if (this.props.xAxes) {
            xAxes = this.props.xAxes;
        }

        let startWithZero = true;
        if (this.props.startWithZero) {
            startWithZero = this.props.startWithZero;
        }

        let options = {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: xAxes
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: yAxes
                    },
                    ticks: {
                        beginAtZero: startWithZero
                    }
                }]
            }
        }




        let data = this.buildData;
        return (
            <Bar data={data} options={options} />
        )
    }
}


class ScatterChart extends React.Component {
    constructor(props) {
        super(props);
        this.colors = COLORS;
    }

    render() {
        let PBR = 0;
        let PHR = 0;
        let PHBW = 0;
        let PR = 0;
        if (this.props.pointBorder === 'y') {
            PBR = 2;
            PHR = 5;
            PHBW = 2;
            PR = 4;
        }
        let lineTension = 0;
        if (this.props.smooth === 'y') {
            lineTension = 0.3;
        }

        let yAxes = '';
        if (this.props.yAxes) {
            yAxes = this.props.yAxes;
        }

        let xAxes = '';
        if (this.props.xAxes) {
            xAxes = this.props.xAxes;
        }

        let dataset = this.props.data.map((data, index) => {
            return (
                {
                    label: this.props.name[index],
                    fill: false,
                    lineTension: lineTension,
                    backgroundColor: this.colors[index][0],
                    borderColor: this.colors[index][0],
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: this.colors[index][0],
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: PBR,
                    pointHoverRadius: PHR,
                    pointHoverBackgroundColor: this.colors[index][0],
                    pointHoverBorderColor: 'rgba(220,220,220,0)',
                    pointHoverBorderWidth: PHBW,
                    pointRadius: PR,
                    pointHitRadius: 10,
                    data: this.props.data[index],
                }
            )
        });
        let data = {
            datasets: dataset
        }
        let options = {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    scaleLabel: {
                        display: true,
                        labelString: xAxes
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: yAxes,
                    }
                }]
            }
        }

        return (
            <div>
                <Line data={data} options={options} />
            </div>
        )
    }
}

export { LineChart, BarChart, ScatterChart };