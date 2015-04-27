import template from '../templates/datatable.jsx';

class DataTable {
    render() {
        const rowsActions = this.props.flux.getActions('rows');
        const actions = {
            firstHeaderButtonClick: (event) => 
                rowsActions.rowsTypeSwitchClicked(
                    event.target.getAttribute('data-type')
                )
        };
        return template(this.props, actions);
    }
}

export default DataTable;
