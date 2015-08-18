import {Component} from 'react';
import template from '../templates/dashboardchart.jsx';

class DashboardChart extends Component {
    render() {
        return template(this.props);
    }
}

export default DashboardChart;