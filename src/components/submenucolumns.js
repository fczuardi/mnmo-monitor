import template from '../templates/submenucolumns.jsx';

class ColumnsSubmenu {
    render() {
        const actions = {
            closeDrawer: () => 
                this.props.flux.getActions('user').closeSubmenu(),
            columnChange: (event) => 
                this.props.flux.getActions('columns').updateColumnSelectedState(event.target.value, event.target.checked)
        };
        return template(this.props, actions);
    }
}

export default ColumnsSubmenu;
