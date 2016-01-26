import template from '../templates/password.jsx';
import tryRender from '../lib/trycomponent';

class ChangePassword {
    render() {
        const userActions = this.props.flux.getActions('user');
        const actions = {
            cancelClick: (event) => {
                event.preventDefault();
                console.log('cancel change password');
                console.log(window.location.search.length);
                //reset browser's location.search
                //to clear any forgot password parameters if they are present
                if (window.location.search.length > 0) {
                    window.location.search = '';
                }
                userActions.navigateToScreen(null);
            },
            formSubmit: (event) => {
                event.preventDefault();
                userActions.changePasswordSubmitted();
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
        return tryRender('password', template, this.props, actions);
    }
}

export default ChangePassword;
