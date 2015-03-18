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
 * @param {string} [nextPath]
 * @param {object[]} [countryOptions]
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
 * @param {object} [styles.loginScreen]
 * @param {object} [styles.loginScreenWrapper]
 * @param {object} [styles.loginSection]
 * @param {object} [styles.sectionTitle]
 * @param {object} [styles.logoSmall]
 * @param {object} [styles.formLine]
 * @param {object} [styles.formLineHack]
 * @param {object} [styles.formControl]
 * @param {object} [styles.formTosLine]
 * @param {object} [styles.countryDropDown]
 * 
 * 
 * 
 **/
import render from './templates/login.jsx';
class LoginForm {
    constructor() {
        this.state = {
            user: {
                username: null,
                password: null
            }    
        };
        this.actions = {
            usernameChange: null,
            usernameBlur: null,
            passwordChange: null,
            passwordBlur: null
        };
        this.render = () => render(this.props, this.state, this.actions);
    }
}
export default LoginForm;