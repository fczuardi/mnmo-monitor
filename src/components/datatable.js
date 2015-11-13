import template from '../templates/datatable.jsx';
import merge from 'lodash/object/merge';
// import keys from 'lodash/object/keys';

class DataTable {
    render() {
        const rowsActions = this.props.flux.getActions('rows');
        let actions = {
            firstHeaderButtonClick: (event) => null
                // rowsActions.rowsTypeSwitchClicked(
                //     event.target.getAttribute('data-type')
                // )
        };
        return template(this.props, actions);
    }
}

export default DataTable;
