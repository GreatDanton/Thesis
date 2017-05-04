import React from 'react';

import {ChannelOptions} from '../components/channelDesign/channelOptions.js';
import GlobalStorage from '../scripts/globalStorage';
import  {createConsumptionCurve} from '../scripts/calculationHelpers';


class ChannelView extends React.Component {
    constructor(props) {
        super(props);
        this.storage = GlobalStorage.channelTab;
    }

    render() {
        return (
            <div>
                <ChannelOptions />
                <div id="channel-parameters"></div>
            </div>
        )
    }
}


export {ChannelView}