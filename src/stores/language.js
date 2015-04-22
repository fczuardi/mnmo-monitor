import {Store} from 'flummox';
import URLs from '../../config/endpoints.js';

import {messagesPt, messagesEs, messagesEn} from '../../config/languageHelpers';

const defaultMessages = messagesPt;

const locales = {
    '1': messagesPt,
    '2': messagesEs,
    '3': messagesEn
};

import {
    authHeaders,
    chooseTextOrJSON,
    parseLanguages
} from '../../config/apiHelpers';

class LanguageStore extends Store {
    constructor(flux) {
        super();
        const sessionStore = flux.getStore('session');
        const sessionActions = flux.getActions('session');
        const userActions = flux.getActions('user');
        this.userStore = flux.getStore('user');
        this.register(userActions.languageUpdate, this.changeLanguage);
        this.register(sessionActions.tokenGranted, this.fetchLanguages);
        this.state = {
            messages: defaultMessages,
            list: []
        };
        this.fetchLanguages(sessionStore.state.token);
    }
    
    fetchLanguages(token) {
        let store = this;
        if (token === null){ return false; }
        fetch(URLs.baseUrl + URLs.languages.list, {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then(chooseTextOrJSON)
        .then(function(payload){
            let languages = parseLanguages(payload).languages;
            store.setState({
                list: languages
            });
        })
        .catch(function(e){
            console.log('parsing failed', e); // eslint-disable-line
        });
    }

    changeLanguage() {
        let self = this;
        this.setState({
            messages: locales[self.userStore.state.languageID]
        });
    }
}

export default LanguageStore;
