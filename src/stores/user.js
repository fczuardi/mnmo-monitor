import {Store} from 'flummox';
import merge from 'lodash/object/merge';
import {
    getObject as getLocalItem,
    setObject as setLocalItem,
    removeObject as removeLocalItem
} from '../lib/local';
import URLs from '../../config/entrypoints.json';
import {parseUserPreferences} from '../../config/apiHelpers';
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
            tosURL: '#',
            preferencesLoading: false,
            languageID: null,
            autoUpdate: null
        };
        this.loadSavedPreferences();
        //user preferences state changed
        this.addListener('change', function(){
            if (this.state.rememberLogin === true) {
                this.savePreferences();
            }
        });
        this.countryStore = flux.getStore('country');
        this.sessionStore = flux.getStore('session');
        //country store changed
        this.countryStore.addListener('change', this.countryOptionsLoaded.bind(this));
        //user session changed
        this.sessionStore.addListener('change', this.sessionStateChanged.bind(this));
        this.sessionStateChanged();
    }
    loadSavedPreferences() {
        this.setState(getLocalItem('userPreference'));
    }
    savePreferences() {
        let localUserPreference = merge({}, this.state);
        delete localUserPreference.preferencesLoading;
        setLocalItem('userPreference', localUserPreference);
    }
    sessionStateChanged() {
        if (this.sessionStore.state.token !== null) {
            console.log('fetch user preferences from the server');
            this.fetchPreferences(this.sessionStore.state.token);
        }
    }
    fetchPreferences(token) {
        let store = this;
        let headers = {
            'Authorization': 'Bearer '+ token
        };
        store.setState({
            preferencesLoading: true
        });
        fetch(URLs.baseUrl + URLs.user.preferences, {
            method: 'GET',
            headers: headers
        })
        .then(function(response) {
            let contentType = response.headers.get('Content-Type'),
                isJSON = (contentType.indexOf('application/json') > -1);
            store.setState({
                preferencesLoading: false
            });
            if (isJSON) {
                return response.json();
            } else {
                console.warn(`got ${contentType} instead of application/json`);
                return response.text();
            }
        })
        .then(function(payload){
            let userPreferences = parseUserPreferences(payload);
            console.log('success', userPreferences);
            //TODO if there were changes while a fetch was going on, we need
            //to compare the different values and sync
            store.setState(userPreferences);
        })
        .catch(function(e){
            console.log('parsing failed', e);
        });
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
    clearPreferences() {
        removeLocalItem('userPreference');
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
