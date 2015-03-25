import {Store} from 'flummox';
import {
    getObject as getLocalItem,
    setObject as setLocalItem
} from '../lib/local';
class UserStore extends Store {
    constructor(flux) {
        super();
        const userActions = flux.getActions('user');
        const countryActions = flux.getActions('country');
        const loginValidationActions = flux.getActions('loginValidation');
        const sessionActions = flux.getActions('session');
        this.flux = flux;
        this.register(userActions.usernameInput, this.changeUsernamePref);
        this.register(userActions.passwordInput, this.changePasswordPref);
        this.register(userActions.rememberLoginUpdate, this.changeRememberPref);
        this.register(userActions.tosAgreementUpdate, this.changeTosPref);
        this.register(countryActions.select, this.changeCountryPref);
        this.register(loginValidationActions.captchaAnswered, this.changeCaptchaAnswer);
        this.register(sessionActions.signOut, this.resetCaptchaAnswer);
        this.state = {
            username: '',
            password: '',
            countryID: null,
            rememberLogin: false,
            captchaAnswer: null,
            tosAgree: false,
            tosURL: '#'
        };
        this.loadPreferences();
        this.addListener('change', function(){
            if (this.state.rememberLogin === true) {
                this.savePreferences();
            }
        });
        this.countryStore = flux.getStore('country');
        this.countryStore.addListener('change', this.countryOptionsLoaded.bind(this));
    }
    loadPreferences() {
        this.setState(getLocalItem('userPreference'));
    }
    savePreferences() {
        setLocalItem('userPreference', this.state);
    }
    clearPreferences() {
        console.log('clear preferences');
        localStorage.removeItem('userPreference');
    }
    countryOptionsLoaded() {
        if (this.state.countryID === null){
            this.flux.getActions('country').select(
                                        this.countryStore.state.options[0].id);
        }
    }
    changeUsernamePref(username) {
        this.setState({
            username: username
        });
    }
    changePasswordPref(password) {
        this.setState({
            password: password
        });
    }
    changeCountryPref(countryID) {
        let tosURL;
        this.countryStore.state.options.forEach(function(item){
            if (item.id === countryID){
                tosURL = item.tosURL;
            }
        });
        this.setState({
            countryID: countryID,
            tosURL: tosURL
        });
    }
    changeCaptchaAnswer(answer) {
        this.setState({
            captchaAnswer: answer
        });
    }
    resetCaptchaAnswer() {
        this.setState({
            captchaAnswer: null
        });
    }
    changeRememberPref(shouldRemember) {
        this.setState({
            rememberLogin: shouldRemember
        });
        if (shouldRemember === false){
            this.clearPreferences();
        }
    }
    changeTosPref(haveAgreed) {
        this.setState({
            tosAgree: haveAgreed
        });
    }
}

export default UserStore;
