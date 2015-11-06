import {Component, findDOMNode} from 'react';
import template from '../templates/dashboardchart.jsx';

class DashboardChart extends Component {
    render() {
        return template(this.props);
    }
    componentDidUpdate() {
        //--- über ugly HACK, remove eventually ---
        //IE has trouble rendering the table cells so we force
        //a redraw by adding one extra <span> element to each <td> element
        //if not possible to remove the code below, at least restrict it to IE
        //with some kind of "if (isInternetExplorer)"
        let chart = findDOMNode(this);
        window.setTimeout(function(){
            let tableElement = chart.childNodes[0];
            let tbodyElement = tableElement.childNodes[0];
            let trElement = tbodyElement.childNodes[0];
            for (var n =0; n < trElement.childNodes.length; n++){
                let tdElement = trElement.childNodes[n];
                tdElement.innerHTML = tdElement.innerHTML + '<span></span>';
            }
        }, 0);
    }
}

export default DashboardChart;
