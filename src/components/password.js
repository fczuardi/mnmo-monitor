import template from '../templates/password.jsx';

class ChangePassword {
    render() {
        const userActions = this.props.flux.getActions('user');
        const actions = {
            cancelClick: (event) => {
                event.preventDefault();
                console.log('cancel change password');
                userActions.navigateToScreen(null);
            }
        };
        return template(this.props, actions);
    }
}

export default ChangePassword;
