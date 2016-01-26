import {Component} from 'react';
import template from '../templates/detailchart.jsx';
import tryRender from '../lib/trycomponent';

class DetailChart extends Component {
    render() {
        return tryRender('detailchart', template, this.props);
    }
}

export default DetailChart;
