import template from '../templates/login.jsx';
import tryRender from '../lib/trycomponent';

class LoginForm {
    constructor() {
        this.actions = {
            usernameChange: (event) =>
                this.props.flux.getActions('user').usernameInput(event.target.value),
            passwordChange: (event) =>
                this.props.flux.getActions('user').passwordInput(event.target.value),
            countrySelect: (event) =>
                this.props.flux.getActions('country').select(event.target.value),
            forgotPasswordClick: (event) => {
                event.preventDefault();
                console.log('forgot password clicked');
                this.props.flux.getActions('user').navigateToScreen('forgotPassword');
            },
            saveInfoChange: (event) =>
                this.props.flux.getActions('user').rememberLoginUpdate(event.target.checked),
            agreementChange: (event) =>
                this.props.flux.getActions('user').tosAgreementUpdate(event.target.checked),
            captchaAnswerChange: (event) =>
                this.props.flux.getActions('loginValidation').captchaAnswered(event.target.value),
            formSubmit: (event) => {
                event.preventDefault();
                this.props.flux.getActions('session').signIn(event.target);
            }
        };
        this.render = () => {
            return tryRender('login', template, this.props, this.actions);
        };
    }
}

export default LoginForm;
