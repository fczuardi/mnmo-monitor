import {Component, findDOMNode} from 'react';
import template from '../templates/dashboardchart.jsx';
import tryRender from '../lib/trycomponent';

class DashboardChart extends Component {
    render() {
        return tryRender('dashboardchart', template, this.props);
    }
}

export default DashboardChart;
