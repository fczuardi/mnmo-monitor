import {Store} from 'flummox';
class UserStore extends Store {
    constructor(flux) {
        super();
        const userActions = flux.getActions('user');
        const countryActions = flux.getActions('country');
        this.register(userActions.rememberLoginUpdate, this.changeRememberPref);
        this.register(userActions.tosAgreementUpdate, this.changeTosPref);
        this.register(countryActions.select, this.changeCountryPref);
        this.state = {
            username: null,
            password: null,
            countryID: null,
            rememberLogin: false,
            tosAgree: false
        };
        this.loadPreferences();
        this.addListener('change', function(){
            if (this.state.rememberLogin === true) {
                this.savePreferences();
            }
        });
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
    changeCountryPref(countryID) {
        this.setState({
            countryID: countryID
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
