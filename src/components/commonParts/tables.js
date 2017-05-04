import React from 'react';


// html table
// parameters:
// header=['item', 'item']
// data=[['data1', 'data1', 'data3']]
export class Table extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let head = this.props.header.map((head, index) => {
            return (
                <th key={index}>
                    {head}
                </th>
            )
        });

        let tableData = this.props.data.map((array, index) => {
            return (
                <Row data={array} key={index} />
            )
        });

        return (
            <table>
                <thead>
                    <tr>
                        {head}
                    </tr>
                </thead>
                <tbody>
                    {tableData}
                </tbody>
            </table>
        )
    }
}

class Row extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let content = this.props.data.map((item, index) => {
            return (
                <td key={index}>{item}</td>
            )
        });

        return (<tr>{content}</tr>)
    }
}