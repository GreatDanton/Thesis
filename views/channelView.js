import React from 'react';

import {ChannelOptions} from '../components/channelDesign/channelOptions.js';


class ChannelView extends React.Component {
    constructor(props) {
        super(props);
        this.radioSelect = this.radioSelect.bind(this);
    }


    radioSelect(e) {
        console.log(e.target);
    }

    channelCardClick(e) {
        console.log(e.target.firstElementChild);
    }

    render() {
        return (
            <div>
            <h1> Channel Design </h1>

            <ChannelOptions />
            </div>
        )
    }
}


export {ChannelView}