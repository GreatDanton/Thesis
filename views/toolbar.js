import React from 'react';


class Toolbar extends React.Component {
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
            <Button icon="folder" onClick={this.btnClick} />

            <Button icon="cog" onClick={this.btnClick} />
            <Button icon="print" onClick={this.btnClick} />
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
            <button className="btn btn-large btn-default btn-toolbar" onClick={this.props.onClick}>
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
            <span className={"icon icon-" + this.props.icon}>
            </span>
        )
    }
}


export {Toolbar};