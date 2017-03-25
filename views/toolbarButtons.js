import React from 'react';
const dialog = require('electron').remote.dialog


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
                properties: ['openFile', 'multiSelections'],
                filters: [{name: 'csv', extensions: ['csv']}],
            },
            // callback (get array of paths of selected files)
            function(fileNames) {
                if (fileNames === undefined) { // no file was chosen
                    return;
                }

                console.log(fileNames);
            },
        );
    }

    runCalculations() {
        console.log('run');
    }

    btnClick(e) {
        console.log(e.target);
    }

    render() {
        return (
            <div>
                <Button icon="folder" tooltip="import file" onClick={this.importFile} />
                <Button icon="cogs" tooltip="run" onClick={this.runCalculations} />
                <Button icon="print" tooltip="print results" onClick={this.btnClick} />
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