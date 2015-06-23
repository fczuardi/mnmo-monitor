import {Component} from 'react';
import template from '../templates/rowheaders.jsx';

class RowHeaders extends Component {
    shouldComponentUpdate(nextProps) {
        return (
            (nextProps.ui.lastVisibleRow !== this.props.ui.lastVisibleRow) ||
            (nextProps.rows.lastLoad > this.props.rows.lastLoad) ||
            (nextProps.ui.screenWidth !== this.props.ui.screenWidth) ||
            (nextProps.ui.screenHeight !== this.props.ui.screenHeight) ||
            (nextProps.columns.enabled.length !== this.props.columns.enabled.length)
        );
    }
    render() {
        // console.log('render RowHeaders');
        return template(this.props);
    }
}

export default RowHeaders;