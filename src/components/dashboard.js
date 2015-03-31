import template from '../templates/dashboard.jsx';

class Dashboard {
    render() {
        const actions = {
            logoutClick: (event) => {
                event.preventDefault();
                this.props.flux.getActions('session').signOut();
            },
            autoUpdateChange: (event) => {
                console.log(event.target.checked);
            },
            languageSettingChange: (event) => {
                console.log('languageSettingChange',event.target.value);
            }
        };
        return template(this.props, actions);
    }
}

export default Dashboard;