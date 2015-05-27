import {Store} from 'flummox';
import {
    getObject as getLocalItem,
    setObject as setLocalItem,
    removeObject as removeLocalItem
} from '../lib/local';
import URLs from '../../config/endpoints.js';
import {
    buildSignInRequestBody,
    parseLoginResponse,
    chooseTextOrJSON
} from '../../config/apiHelpers';

class SessionStore extends Store {
    constructor(flux) {
        super();
        const sessionActions = flux.getActions('session');
        this.flux = flux;
        this.register(sessionActions.signIn, this.signIn);
        this.register(sessionActions.signOut, this.signOut);
        this.state = {
            token: null,
            error: null
        };
        this.sessionActions = sessionActions;
        this.loadSavedToken();
    }
    loadSavedToken() {
        this.setState({
            token: getLocalItem('sessionToken')
        });
    }
    signIn() {
        let store = this,
            userStore = store.flux.getStore('user'),
            validationStore = store.flux.getStore('loginValidation');

        store.setState({
            error: null
        });
        console.log('POST', URLs.session.login);
        fetch(URLs.baseUrl + URLs.session.login, {
        // fetch(URLs.baseUrl + URLs.session.loginError, {
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: buildSignInRequestBody(validationStore, userStore)
        })
        .then(chooseTextOrJSON)
        .then(function(payload) {
            console.log('result (post)', URLs.session.login, payload);
            console.log('OK (post)', URLs.session.login);
            let sessionData = parseLoginResponse(payload);
            if (sessionData.token){
                store.setState(sessionData);
                setLocalItem('sessionToken', sessionData.token);
                store.flux.getActions('session').tokenGranted(sessionData.token);
            }else if (sessionData.error) {
                store.setState({
                    error: (sessionData.error_description || sessionData.error)
                });
                store.sessionActions.signOut();
            }
        })
        .catch(function(e){
            console.log('Error: ' + URLs.session.login, e); // eslint-disable-line
        });
    }
    signOut(){
        this.setState({
            token: null
        });
        removeLocalItem('sessionToken');
    }
}

export default SessionStore;
