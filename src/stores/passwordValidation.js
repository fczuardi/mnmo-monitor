import {Store} from 'flummox';
import URLs from '../../config/endpoints.js';
import queryString from 'query-string';
import keys from 'lodash/object/keys';
import {
    chooseTextOrJSON,
    statusRouter,
    parseForgotPasswordToken
} from '../../config/apiHelpers';

const submitLabelKeys = {
    validatingToken: 'validatingToken',
    change: 'change'
};

class PasswordValidationStore extends Store {
    constructor(flux) {
        super();

        const sessionActions = flux.getActions('session');
        this.sessionActions = sessionActions;
        this.flux = flux;

        //if the user clicked on a forgot password email link
        //the app will be opened with a token passed as parameter
        //in the browser's location.search
        let forgotPasswordToken = queryString.parse(window.location.search).token || null;
        let submitLabelKey = forgotPasswordToken ? submitLabelKeys.validatingToken : submitLabelKeys.change;
        let canSubmit = (forgotPasswordToken === null);
        this.state = {
            submitLabelKey: submitLabelKey,
            canSubmit: canSubmit,
            forgotPasswordToken: forgotPasswordToken
        };
        this.userActions = flux.getActions('user');
        if (forgotPasswordToken){
            this.checkForgotPasswordToken(forgotPasswordToken);
        }
    }

    checkForgotPasswordToken(token) {
        let store = this;
        let params = {};
        let qsParams = queryString.parse(window.location.search);
        let qsParamsLower = {};
        keys(qsParams).forEach( (key) => {
            qsParamsLower[key.toLowerCase()] = qsParams[key];
        });
        params[URLs.user.tokenParam] = token;
        params[URLs.user.countryParam] = qsParamsLower[URLs.user.countryParam.toLowerCase()];
        params[URLs.user.language] = qsParams[URLs.user.language];
        let url = URLs.baseUrl + URLs.user.forgotPassword + '?' +
                    queryString.stringify(params);
        console.log('GET', url);
        fetch(url, {method: 'GET'})
        .then((response) => statusRouter(response, store.sessionActions.signOut))
        .then(chooseTextOrJSON)
        .then(function(payload){
            console.log('OK (get)', URLs.user.forgotPassword, payload);
            let languageStore = store.flux.getStore('language');
            let result = parseForgotPasswordToken(payload, languageStore.state.messages);
            console.log('parsed result forgot token', result);
            if (result.success){
                store.setState({
                    canSubmit: true,
                    submitLabelKey: submitLabelKeys.change,
                    forgotPasswordToken: store.state.forgotPasswordToken
                });
            } else {
                //clear invalid password token
                store.setState({
                    forgotPasswordToken: null
                });
                store.userActions.navigateToScreen(null);
                store.userActions.errorArrived(result.error);
            }
        })
        .catch(function(e){
            console.log('forgot password token check failed' + URLs.user.forgotPassword, e); // eslint-disable-line
        });
    }
}

export default PasswordValidationStore;
