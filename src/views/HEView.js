import React from 'react';

import {HeDesign} from '../components/HeDesign/HeDesign.js'

class HeView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <HeDesign />
            </div>
        )
    }
}

export {HeView}