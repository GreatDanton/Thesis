import React from 'react';
import {Line} from 'react-chartjs-2';
// line chart example


class LineChart extends React.Component {
    constructor(props) {
        super(props);
        this.buildData = this.buildData.bind(this);
        this.colors = [
            ['rgba(54,162,235,1)', 'rgba(54,162,235,0.2)'],
            ['rgba(255,99,132,1)', 'rgba(255,99,132,0.2)'],
            ['rgba(75,193,193,1)', 'rgba(75,193,193,0.2)'],
            ['rgba(255,206,86,1)', 'rgba(255,99,132,0.2)']
        ]
    }

    buildData() {
        let dataset = this.props.data.map((data, index) => {
            return (
                {
                    label: this.props.name[index],
                    fill: false,
                    likeTension: 0.1,
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
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: data
                }
            )
        });

        let finalData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'],
            datasets: dataset
        }

        return finalData;
    }


    render() {
        let dataset = this.buildData;
        return (
            <div>
                <Line data={dataset} />
            </div>
        )
    }
}

export {LineChart};