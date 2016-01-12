import {Store} from 'flummox';
import URLs from '../../config/endpoints.js';

import {messagesPt, messagesEs, messagesEn} from '../../config/languageHelpers';

const defaultMessages = messagesPt;
const defaultLanguageID = '1';


const locales = {
    '1': messagesPt,
    '2': messagesEs,
    '3': messagesEn
};

import {
    authHeaders,
    statusRouter,
    chooseTextOrJSON,
    parseLanguages
} from '../../config/apiHelpers';

class LanguageStore extends Store {
    constructor(flux) {
        super();
        const sessionStore = flux.getStore('session');
        const userActions = flux.getActions('user');
        const sessionActions = flux.getActions('session');
        this.sessionStore = sessionStore;
        this.sessionActions = sessionActions;
        this.register(userActions.preferencesFetched, this.userPreferencesFetched);
        this.register(userActions.localPreferencesFetched, this.userPreferencesFetched);
        this.register(userActions.languageUpdate, this.changeLanguage);
        this.state = {
            messages: defaultMessages,
            list: []
        };
    }

    userPreferencesFetched(pref){
        this.changeLanguage(pref.languageID || defaultLanguageID);
        this.fetchLanguages();
    }

    fetchLanguages(token) {
        let store = this;
        token = token || store.sessionStore.state.token;
        if (token === null){ return false; }
        console.log('GET', URLs.languages.list);
        fetch(URLs.baseUrl + URLs.languages.list, {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then((response) => statusRouter(response, store.sessionActions.signOut))
        .then(chooseTextOrJSON)
        .then(function(payload){
            // console.log('result', URLs.languages.list, payload);
            console.log('OK', URLs.languages.list);
            let languages = parseLanguages(payload).languages;
            store.setState({
                list: languages
            });
        })
        .catch(function(e){
            console.log('parsing failed ' + URLs.languages.list, e); // eslint-disable-line
        });
    }

    changeLanguage(languageID) {
        this.setState({
            messages: locales[languageID]
        });
    }
}

export default LanguageStore;
