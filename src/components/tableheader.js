import {Component, findDOMNode} from 'react';
import template from '../templates/tableheader.jsx';

class TableHeader extends Component {
    shouldComponentUpdate(nextProps) {
        let node = findDOMNode(this);
        node.scrollLeft = nextProps.ui.tableScrollLeft;
        return (nextProps.rows.lastLoad > this.props.rows.lastLoad);
    }
    render() {
        console.log('render TableHeader');
        return template(this.props);
    }
}

export default TableHeader;