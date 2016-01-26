import template from '../templates/menu.jsx';
import tryRender from '../lib/trycomponent';
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
                userActions.navigateToScreen('password');
            },
            printClick: (event) => {
                event.preventDefault();
                userActions.printRequested();
            },
            autoUpdateChange: (event) =>
                p.flux.getActions('user').autoUpdateToggle(event.target.checked),
            languageSettingChange: (event) =>
                p.flux.getActions('user').languageUpdate(event.target.value),
            openColumnsSelection: (event) => {
                event.preventDefault();
                // if the user doesnt have a selected group
                // open the group selection panel instead
                // of the columns subpanel
                if (p.groups.selected === null){
                    p.flux.getActions('user').openPanel('groups');
                }else{
                    p.flux.getActions('user').openSubmenu('columns');
                }
            }
        };
        p.panelsOpened = (p.ui.submenu !== null) ? 2 : 1;
        return tryRender('menu', template, p, actions);
    }
}

export default Menu;
