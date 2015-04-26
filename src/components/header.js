import template from '../templates/header.jsx';

class Header {
    render() {
        const actions = {
            menuToggleClicked: (event) => {
                event.stopPropagation();
                this.props.flux.getActions('user').menuVisibilityToggle();
            },
            groupsButtonClicked: () =>
                this.props.flux.getActions('user').openPanel('groups'),
            varsButtonClicked: () => {
                this.props.flux.getActions('user').openPanel('vars');
            },
            rowsButtonClicked: () => {
                this.props.flux.getActions('user').openPanel('rows');
            }
        };
        return template(this.props, actions);
    }
}

export default Header;
