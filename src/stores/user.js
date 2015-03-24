import {Store} from 'flummox';
class UserStore extends Store {
    constructor(flux) {
        super();
        const userActions = flux.getActions('user');
        const countryActions = flux.getActions('country');
        this.flux = flux;
        this.register(userActions.usernameInput, this.changeUsernamePref);
        this.register(userActions.passwordInput, this.changePasswordPref);
        this.register(userActions.rememberLoginUpdate, this.changeRememberPref);
        this.register(userActions.tosAgreementUpdate, this.changeTosPref);
        this.register(countryActions.select, this.changeCountryPref);
        this.state = {
            username: '',
            password: '',
            countryID: null,
            rememberLogin: false,
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
        var ls = localStorage.getItem('userPreference'),
            parsedObj = {};
        try{
            parsedObj = JSON.parse(ls);
            console.log('Preferences loaded:', parsedObj);
            this.setState(parsedObj);
        } catch (e){
            //rubish in the session cookie
            console.log(e.message);
        }
    }
    savePreferences() {
        console.log('save user preference', this.state);
        localStorage.setItem('userPreference', JSON.stringify(this.state));
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
        console.log('change username', username);
        this.setState({
            username: username
        });
    }
    changePasswordPref(password) {
        console.log('change password', password);
        this.setState({
            password: password
        });
    }
    changeCountryPref(countryID) {
        console.log('change country pref', countryID);
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
