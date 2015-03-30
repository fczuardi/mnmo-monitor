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
        console.log('dashboard', this.props.country.options, this.props.user.languageID);
        return template(this.props, actions);
    }
}

export default Dashboard;