import template from '../templates/datatable.jsx';
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
        return template(this.props, actions);
    }
}

export default DataTable;
