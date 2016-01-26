import template from '../templates/forgotpassword.jsx';
import tryRender from '../lib/trycomponent';

class ForgotPassword {
    render() {
        const userActions = this.props.flux.getActions('user');
        const actions = {
            countrySelect: (event) =>
                this.props.flux.getActions('country').select(event.target.value),
            emailChange: (event) =>
                userActions.emailInput(event.target.value),
            cancelClick: (event) => {
                event.preventDefault();
                userActions.navigateToScreen(null);
            },
            formSubmit: (event) => {
                event.preventDefault();
                userActions.forgotPasswordSubmitted();
            }
        };
        return tryRender('forgotpassword', template, this.props, actions);
    }
}

export default ForgotPassword;
