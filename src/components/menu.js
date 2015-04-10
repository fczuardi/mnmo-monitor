import template from '../templates/menu.jsx';
import merge from 'lodash/object/merge';

class Menu {
    render() {
        const p = merge({}, this.props);
        const actions = {
            logoutClick: (event) => {
                event.preventDefault();
                p.flux.getActions('session').signOut();
            },
            autoUpdateChange: (event) =>
                p.flux.getActions('user').autoUpdateToggle(event.target.checked),
            languageSettingChange: (event) =>
                p.flux.getActions('user').languageUpdate(event.target.value),
            openColumnsSelection: (event) => {
                event.preventDefault();
                p.flux.getActions('user').openSubmenu('columns');
            }
        };
        p.panelsOpened = (p.ui.submenu !== null) ? 2 : 1;
        return template(p, actions);
    }
}

export default Menu;
