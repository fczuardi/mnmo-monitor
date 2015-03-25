/**
 * Login screen
 *
 * @class
 *
 * Properties
 * ----------
 * @param {object} [country] - the state of the country store, see stores/country.js
 * @param {string} [country.selected] - the selected country ID
 * @param {object} [user] - the state of the user store, see stores/user.js
 * @param {string} [user.username]
 * @param {string} [user.password]
 * @param {boolean} [user.rememberLogin]
 * @param {boolean} [user.tosAgree]
 * @param {string} [nextPath]
 * @param {function} [onSubmit]
 * @param {function} [onInputBlur]
 * @param {function} [onCountryChange]
 * @param {function} [onChangeSaveInfo]
 * @param {function} [onChangeAgreement]
 * @param {object} [messages]
 * @param {string} [messages.login]
 * @param {string} [messages.login.welcome]
 * @param {string} [messages.login.username]
 * @param {string} [messages.login.password]
 * @param {string} [messages.login.saveInfo]
 * @param {string} [messages.login.iAgree]
 * @param {string} [messages.login.tos]
 *
 **/
import render from '../templates/login.jsx';

class LoginForm {
    constructor() {
        this.actions = {
            usernameChange: (event) =>
                this.props.flux.getActions('user').usernameInput(event.target.value),
            passwordChange: (event) =>
                this.props.flux.getActions('user').passwordInput(event.target.value),
            countrySelect: (event) =>
                this.props.flux.getActions('country').select(event.target.value),
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
            return render(this.props, this.actions);
        };
    }
}

export default LoginForm;
