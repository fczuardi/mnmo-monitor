import template from '../templates/header.jsx';

class Header {
    render() {
        const actions = {
            menuToggleClicked: (event) => {
                event.stopPropagation();
                this.props.flux.getActions('user').menuVisibilityToggle();
            }
        };
        return template(this.props, actions);
    }
}

export default Header;
