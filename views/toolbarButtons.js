import React from 'react';


class ToolbarButtons extends React.Component {
    constructor(props) {
        super(props);
        this.btnClick = this.btnClick.bind(this);
    }

    btnClick(e) {
        console.log(e.target);
    }

    render() {
        return (
            <div>
                <Button icon="folder" tooltip="open file" onClick={this.btnClick} />
                <Button icon="cogs" tooltip="run" onClick={this.btnClick} />
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