import {Component} from 'react';
import template from '../templates/tableheader.jsx';

class TableHeader extends Component {
    shouldComponentUpdate(nextProps) {
        let newColumns = nextProps.columns.enabled.map((column) => (column.id)).join(','),
            oldColumns = this.props.columns.enabled.map((column) => (column.id)).join(','),
            newColumnsErrors = nextProps.columns.enabled.map((column) => (column.iconError)).join(','),
            oldColumnsErrors = this.props.columns.enabled.map((column) => (column.iconError)).join(',');
        return (
            (newColumns !== oldColumns) ||
            (newColumnsErrors !== oldColumnsErrors) ||
            (nextProps.rows.lastLoad > this.props.rows.lastLoad) ||
            (nextProps.ui.screenWidth !== this.props.ui.screenWidth) ||
            (nextProps.groups.selected !== this.props.groups.selected)
        );
    }
    render() {
        // console.log('render TableHeader');
        let columnActions = this.props.flux.getActions('columns');
        const actions = {
            onHeaderCellClick: columnActions.columnHeaderSelected,
            onImageError: (event) => {
                columnActions.columnIconFailed(event.target.getAttribute('data-id'));
            }
        };
        return template(this.props, actions);
    }
}

export default TableHeader;