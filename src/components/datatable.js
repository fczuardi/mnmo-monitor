import template from '../templates/datatable.jsx';

class DataTable {
    render() {
        const rowsActions = this.props.flux.getActions('rows');
        const userActions = this.props.flux.getActions('user');
        const actions = {
            firstHeaderButtonClick: (event) => 
                rowsActions.rowsTypeSwitchClicked(
                    event.target.getAttribute('data-type')
                ),
            draggableAreaScroll: (event) =>
                userActions.tableScroll(
                    event.target.scrollTop, event.target.scrollLeft
                )
        };
        return template(this.props, actions);
    }
}

export default DataTable;
