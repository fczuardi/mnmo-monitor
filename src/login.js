/**
 * Login screen
 * 
 * State
 * -----
 * @param {object} [user]
 * @param {string} [user.username]
 * @param {boolean} [user.rememberLogin]
 * @param {boolean} [user.tosAgree]
 * @param {object} [country]
 * @param {string} [country.selected]
 * 
 * 
 * 
 * Properties
 * ----------
 * @param {Array.<{id:string, label:string}>} [countryOptions]
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
 * @param {object} [styles]
 * 
 **/
import render from './templates/login.jsx';
class LoginForm {
    constructor(props) {
        this.state = {
            user: {
                username: null,
                password: null,
                rememberLogin: null,
                tosAgree: null
            },
            country: {
                selected: null,
                tosURL: '#'
            },
            loginForm: {
                submitButtonLabel: props.messages.login.submit.access,
                submitButtonDisabled: null
            }
        };
        this.actions = {
            usernameChange: null,
            usernameBlur: null,
            passwordChange: null,
            passwordBlur: null,
            countrySelect: null,
            countryBlur: null,
            saveInfoChange: null,
            agreementChange: null
        };
        this.render = () => render(this.props, this.state, this.actions);
    }
}

export default LoginForm;