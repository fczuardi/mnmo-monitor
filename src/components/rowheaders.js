import {Component, findDOMNode} from 'react';
import template from '../templates/rowheaders.jsx';

class RowHeaders extends Component {
    shouldComponentUpdate(nextProps) {
        let node = findDOMNode(this);
        node.scrollTop = nextProps.ui.tableScrollTop;
        return (nextProps.rows.lastLoad > this.props.rows.lastLoad);
    }
    render() {
        console.log('render RowHeaders');
        return template(this.props);
    }
}

export default RowHeaders;