import React from 'react';
import ReactDOM from 'react-dom';

const fs = require('fs'); // load file system;
const dialog = require('electron').remote.dialog

// import globalStorage
import GlobalStorage from '../scripts/globalStorage';
import {createMonthlyFlow, getExtremeFlow, createGraphData, getAverageData} from '../scripts/parseCsv';
import {ResultsView} from './resultsView';


class ToolbarButtons extends React.Component {
    constructor(props) {
        super(props);
        this.btnClick = this.btnClick.bind(this);
        this.importFile = this.importFile.bind(this);
    }

    importFile() {
        console.log('File imported');
        dialog.showOpenDialog(
            {
                properties: ['openFile'],
                filters: [{name: 'csv', extensions: ['csv']}],
            },
            // callback (get array of paths of selected files)
            function(fileNames) {
                if (fileNames === undefined) { // no file was chosen
                    return;
                }

                // read from first file
                let filepath = fileNames[0];
                fs.readFile(filepath,'utf-8', function(err, data) {
                    if (err) {
                        alert("An error occured");
                        return;
                    }

                    // inserting data in global object - memory
                    let parsedData = createMonthlyFlow(data);
                    let average = getAverageData(parsedData);
                    let extremes = getExtremeFlow(parsedData);
                    let wetYear = extremes.wetYear;
                    let dryYear = extremes.dryYear;

                    // GlobalStorage.resultsTab.rawData = data;
                    GlobalStorage.resultsTab.parsedData = parsedData;
                    GlobalStorage.resultsTab.wetYear = wetYear;
                    GlobalStorage.resultsTab.dryYear = dryYear;
                    // store graph data;
                    let wetYearData = createGraphData(wetYear, parsedData);
                    let dryYearData = createGraphData(dryYear, parsedData);
                    let averageYearData = average;
                    GlobalStorage.resultsTab.hydrogram.x = "months";
                    GlobalStorage.resultsTab.hydrogram.y = [wetYearData, dryYearData, averageYearData];
                    GlobalStorage.resultsTab.hydrogram.names = [`wet year(${wetYear})`, `dry year(${dryYear})`, 'average'];
                    console.log(GlobalStorage);

                    // if button is clicked when results tab is active, rerender results tab (show hydrogram)
                    if (GlobalStorage.activeTab === 'Results') {
                        ReactDOM.render(
                            <ResultsView />,
                            document.getElementById('main-window')
                        )
                    }

                });
            },
        );
    }


    runCalculations() {
        console.log('run');
    }

    btnClick(e) {
        console.log(e.target);
    }
    // those two buttons were before in render()
    // <Button icon="cogs" tooltip="run" onClick={this.runCalculations} />
    //<Button icon="print" tooltip="print results" onClick={this.btnClick} />

    render() {
        return (
            <div>
                <Button icon="folder" tooltip="import file" onClick={this.importFile} />
            </div>

        )
    }
}


class Button extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <button className="btn btn-toolbar"
                    onClick={this.props.onClick} title={this.props.tooltip} >
                <Icon icon={this.props.icon} />
            </button>
        )
    }
}

class Icon extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <i className={"fa fa-" + this.props.icon} />
        )
    }
}


export {ToolbarButtons};