import template from '../templates/menu.jsx';
import merge from 'lodash/object/merge';

class Menu {
    render() {
        const p = merge({}, this.props);
        const userActions = p.flux.getActions('user');
        const actions = {
            closePanel: () => 
                userActions.closePanel(),
            logoutClick: (event) => {
                event.preventDefault();
                p.flux.getActions('session').signOut();
            },
            changePasswordClick: (event) => {
                event.preventDefault();
                console.log('change password clicked');
                userActions.navigateToScreen('password');
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
