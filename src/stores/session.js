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
    chooseTextOrJSON,
    languageNames
} from '../../config/apiHelpers';

const REFRESH_TIME = 3 * 1000;

class SessionStore extends Store {
    constructor(flux) {
        super();
        const sessionActions = flux.getActions('session');
        const userActions = flux.getActions('user');
        this.flux = flux;
        this.register(sessionActions.signIn, this.signIn);
        this.register(sessionActions.signOut, this.signOut);
        this.userActions = userActions;
        this.state = {
            token: null,
            error: null
        };
        this.sessionActions = sessionActions;
        if (window.addEventListener) {
            window.addEventListener('unload', this.saveTimestamp.bind(this));
        }else{
            window.attachEvent('onunload', this.saveTimestamp.bind(this));
        }
        //after all initial setup, load local token
        window.setTimeout(this.loadSavedToken.bind(this), 0);
    }
    loadSavedToken() {
        let unloadTimestamp = getLocalItem('unloadTimestamp');
        let timestamp = new Date().getTime();
        let isUserRefresh = timestamp - unloadTimestamp < REFRESH_TIME;
        // console.log('loadSavedToken', timestamp, unloadTimestamp, isUserRefresh);
        if (!isUserRefresh){
            return null;
        }
        let token = getLocalItem('sessionToken');
        let refreshData = getLocalItem('refreshData');
        this.setState({
            token: token
        });
        // console.log('call tokenGranted action', token);
        this.flux.getActions('session').refreshDataLoaded(refreshData);
        this.flux.getActions('session').tokenGranted(token);
        if (refreshData.ui.secondTableVisible){
            this.userActions.secondTableEnabled();
        }
    }
    // save a timestamp locally if the app unloads
    // in order to be able to compare it with the next time the app loads
    // and use the same session if the user "hits refresh"
    // which means unload and load again before 3 seconds
    saveTimestamp(){
        let timestamp = new Date().getTime();
        //save extra information to help rebuild user's screen
        let uiState = this.flux.getStore('ui').state;
        let rowsState = this.flux.getStore('rows').state;
        let userState = this.flux.getStore('user').state;
        let refreshData = {
            user: {
                newSecondaryRow: userState.newSecondaryRow
            },
            ui: {
                chartVisible: uiState.chartVisible,
                secondTableVisible: uiState.secondTableVisible
            },
            rows: {
                type: rowsState.type,
                secondary: rowsState.secondary
            }
        };
        setLocalItem('unloadTimestamp', timestamp);
        setLocalItem('refreshData', refreshData);
        // console.log('saveTimestamp', timestamp, JSON.stringify(refreshData));
    }
    signIn() {
        let store = this,
            userStore = store.flux.getStore('user'),
            validationStore = store.flux.getStore('loginValidation'),
            url = URLs.baseUrl + URLs.session.login,
            postBody = buildSignInRequestBody(validationStore, userStore);

        store.setState({
            error: null
        });
        // console.log('POST', url, postBody);
        fetch(url, {
        // fetch(URLs.baseUrl + URLs.session.loginError, {
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: postBody
        })
        .then(chooseTextOrJSON)
        .then(function(payload) {
            console.log('result (post)', URLs.session.login, payload);
            console.log('OK (post)', URLs.session.login);
            let sessionData = parseLoginResponse(payload);
            let sessionDataError = (sessionData.error_description || sessionData.error);
            if (sessionData.token){
                store.setState(sessionData);
                setLocalItem('sessionToken', sessionData.token);
                store.flux.getActions('session').tokenGranted(sessionData.token);
            }else if (sessionData.error) {
                store.sessionActions.signOut();
                if (sessionData.error === 'password_expired'){
                    store.userActions.navigateToScreen('password');
                    store.userActions.errorArrived(sessionDataError);
                }else{
                    store.setState({
                        error: sessionDataError
                    });
                }
            }
        })
        .catch(function(e){
            console.log('Error: ' + URLs.session.login, e); // eslint-disable-line
            store.setState({
                error: e.name + ': ' + e.message
            });
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
