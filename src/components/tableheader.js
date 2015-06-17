import {Component} from 'react';
import template from '../templates/tableheader.jsx';

class TableHeader extends Component {
    shouldComponentUpdate(nextProps) {
        let newColumns = nextProps.columns.enabled.map((column) => (column.id)).join(','),
            oldColumns = this.props.columns.enabled.map((column) => (column.id)).join(',');
        return (
            (newColumns !== oldColumns) ||
            (nextProps.rows.lastLoad > this.props.rows.lastLoad) ||
            (nextProps.ui.screenWidth !== this.props.ui.screenWidth)
        );
    }
    render() {
        // console.log('render TableHeader');
        const actions = {
            onHeaderCellClick: this.props.flux.getActions('columns').columnHeaderSelected
        };
        return template(this.props, actions);
    }
}

export default TableHeader;