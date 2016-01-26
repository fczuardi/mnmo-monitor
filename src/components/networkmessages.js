import template from '../templates/networkmessages.jsx';
import tryRender from '../lib/trycomponent';

class NetworkMessages {
    render() {
        return tryRender('networkmessages', template, this.props);
    }
}

export default NetworkMessages;
