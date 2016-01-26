import template from '../templates/datatable.jsx';
import tryRender from '../lib/trycomponent';
import merge from 'lodash/object/merge';
// import keys from 'lodash/object/keys';

class DataTable {
    render() {
        const userActions = this.props.flux.getActions('user');
        let actions = {
            firstHeaderButtonClick: (event) => {
                userActions.splitScreenButtonToggle();
            }
        };
        return tryRender('datatable', template, this.props, actions);
    }
}

export default DataTable;
