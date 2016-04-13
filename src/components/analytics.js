import {analyticsCodes} from '../../config/apiHelpers';
import {DOM} from 'react';
class Analytics {
    componentDidMount() {
        let analyticsCode = analyticsCodes[parseInt(this.props.user.countryID)];
        // console.warn('REMOVE this warning after uncomment', analyticsCode);
        //uncomment the 2 lines below to start computing pageviews
        // window.ga('create', analyticsCode, 'auto');
        // window.ga('send', 'pageview');

    }
    render(){
        return null;
    }
}
export default Analytics;
