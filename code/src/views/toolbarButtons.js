import React from 'react';
import ReactDOM from 'react-dom';


// import globalStorage
import GlobalStorage from '../scripts/globalStorage';
import { createMonthlyFlow, getExtremeFlow, createGraphData, getAverageData } from '../scripts/parseCsv';
import { ResultsView } from './resultsView';

// Renders button that is displayed in toolbar.
class ToolbarButtons extends React.Component {
    constructor(props) {
        super(props);
        this.btnClick = this.btnClick.bind(this);
        this.importFile = this.importFile.bind(this);
    }

    // imports chosen file and manages data
    importFile(e) {
        console.log('File imported');
        // inserting data in global object - memory
        let data;
        let file = e.target.files[0];

        if (!file) { return; }

        let reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function (e) {
            data = e.target.result;
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

            // if button is clicked when results tab is active, rerender results tab (show
            // hydrogram)
            if (GlobalStorage.activeTab === 'Results') {
                ReactDOM.render(
                    <ResultsView />, document.getElementById('main-window'))
            }
        };
    }

    // on btn click click input file
    btnClick(e) {
        document.getElementById('selectedFile').click();
    }

    // renders ugly input button and regular button.
    // Input button is used for choosing csv file with data and is hidden by default
    // Regular button has event listener that clicks input button.
    render() {
        return (
            <div>
                <input id="selectedFile" type="file" onChange={this.importFile} />
                <Button tooltip="Import csv data" icon="folder" onClick={this.btnClick}> ABc </Button>
            </div>
        )
    }
}

class Button extends React.Component {
    render() {
        return (
            <button
                className="btn btn-toolbar"
                onClick={this.props.onClick}
                title={this.props.tooltip}>
                <Icon icon={this.props.icon} />
            </button>
        )
    }
}

class Icon extends React.Component {
    render() {
        return (<i className={"fa fa-" + this.props.icon} />)
    }
}

export { ToolbarButtons };