import {Component, findDOMNode} from 'react';
import template from '../templates/rowheaders.jsx';

class RowHeaders extends Component {
    render() {
        return template(this.props);
    }
    componentDidUpdate() {
        let node = findDOMNode(this);
        node.scrollTop = this.props.ui.tableScrollTop;
    }
}

export default RowHeaders;