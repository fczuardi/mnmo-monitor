import template from '../templates/menu.jsx';

class Menu {
    render() {
        const actions = {
            logoutClick: (event) => {
                event.preventDefault();
                this.props.flux.getActions('session').signOut();
            },
            autoUpdateChange: (event) =>
                this.props.flux.getActions('user').autoUpdateToggle(event.target.checked),
            languageSettingChange: (event) =>
                this.props.flux.getActions('user').languageUpdate(event.target.value)
        };
        return template(this.props, actions);
    }
}

export default Menu;
