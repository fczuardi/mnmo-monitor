import {Store} from 'flummox';

import {messagesPt, messagesEs, messagesEn} from '../../config/languageHelpers';

const defaultMessages = messagesPt;

const locales = {
    '1': messagesPt,
    '2': messagesEs,
    '3': messagesEn
};

class LanguageStore extends Store {
    constructor(flux) {
        super();
        const userActions = flux.getActions('user');
        this.userStore = flux.getStore('user');
        this.register(userActions.languageUpdate, this.changeLanguage);
        this.state = {
            messages: defaultMessages
        };
    }
    changeLanguage() {
        let self = this;
        this.setState({
            messages: locales[self.userStore.state.languageID]
        });
    }
}

export default LanguageStore;
