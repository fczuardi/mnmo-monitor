import {Component} from 'react';
import template from '../templates/rowheaders.jsx';

class RowHeaders extends Component {
    shouldComponentUpdate(nextProps) {
        return (
            (nextProps.ui.visibleStart !== this.props.ui.visibleStart) ||
            (nextProps.ui.visibleEnd !== this.props.ui.visibleEnd) ||
            (nextProps.rows.lastLoad > this.props.rows.lastLoad) ||
            (nextProps.ui.screenWidth !== this.props.ui.screenWidth) ||
            (nextProps.ui.screenHeight !== this.props.ui.screenHeight)
        );
    }
    render() {
        // console.log('render RowHeaders');
        return template(this.props);
    }
}

export default RowHeaders;