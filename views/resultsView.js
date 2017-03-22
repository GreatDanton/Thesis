import React from 'react';

import {LineChart} from '../components/commonParts/charts.js';

class ResultsView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1> ResultsView </h1>
                <LineChart />
            </div>
        )
    }
}


export {ResultsView};