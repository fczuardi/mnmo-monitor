import {Component, findDOMNode} from 'react';
import template from '../templates/tableheader.jsx';

class TableHeader extends Component {
    render() {
        return template(this.props);
    }
    componentDidUpdate() {
        let node = findDOMNode(this);
        node.scrollLeft = this.props.ui.tableScrollLeft;
    }
}

export default TableHeader;