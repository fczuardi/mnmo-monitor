import template from '../templates/submenucolors.jsx';
import tryRender from '../lib/trycomponent';

class ColorSubmenu {
    render() {
        const columnActions = this.props.flux.getActions('columns')
        const actions = {
            closeDrawer: () =>
                this.props.flux.getActions('user').openSubmenu('columns'),
            onImageError: (event) => {
                columnActions.columnIconFailed(event.target.getAttribute('data-id'));
            },
            openColorSwitch: (index) => {
                this.props.flux.getActions('columns').colorSwitchToggle(index);
            },
            colorClick: (key, color) => {
                this.props.flux.getActions('columns').columnColorChanged(key, color);
            }
        };
        return tryRender('submenucolors', template, this.props, actions);
    }
}

export default ColorSubmenu;
