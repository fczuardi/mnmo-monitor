import template from '../templates/forgotpassword.jsx';

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
        return template(this.props, actions);
    }
}

export default ForgotPassword;
