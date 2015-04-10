import template from '../templates/submenucolumns.jsx';

class ColumnsSubmenu {
    render() {
        const actions = {
            closeDrawer: () => this.props.flux.getActions('user').closeSubmenu()
        };
        return template(this.props, actions);
    }
}

export default ColumnsSubmenu;
