import template from '../templates/password.jsx';

class ChangePassword {
    render() {
        const userActions = this.props.flux.getActions('user');
        const actions = {
            cancelClick: (event) => {
                event.preventDefault();
                console.log('cancel change password');
                userActions.navigateToScreen(null);
            },
            currentPasswordChange: (event) => {
                userActions.currentPasswordInput(event.target.value);
            },
            newPasswordChange: (event) => {
                userActions.newPasswordInput(event.target.value);
            },
            confirmNewPasswordChange: (event) => {
                userActions.confirmNewPasswordInput(event.target.value);
            }
        };
        return template(this.props, actions);
    }
}

export default ChangePassword;
