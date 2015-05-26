import {Component} from 'react';
import template from '../templates/rowheaders.jsx';

class RowHeaders extends Component {
    shouldComponentUpdate(nextProps) {
        return (nextProps.rows.lastLoad > this.props.rows.lastLoad);
    }
    render() {
        console.log('render RowHeaders');
        return template(this.props);
    }
}

export default RowHeaders;