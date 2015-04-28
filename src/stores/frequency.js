import {Store} from 'flummox';
import URLs from '../../config/endpoints.js';
import {
    authHeaders,
    statusRouter,
    chooseTextOrJSON,
    parseFrequencies
} from '../../config/apiHelpers';

class FrequencyStore extends Store {
    constructor(flux) {
        super();
        const userActions = flux.getActions('user');
        const sessionActions = flux.getActions('session');
        const sessionStore = flux.getStore('session');
        this.sessionStore = sessionStore;
        this.userStore = flux.getStore('user');
        this.sessionActions = sessionActions;
        this.register(userActions.preferencesFetched, this.fetchOptions);
        this.state = {
            options: []
        };
    }

    fetchOptions() {
        let store = this;
        let token = this.sessionStore.state.token;
        if (token === null){ return false; }
        let countryID = this.userStore.state.countryID || '1',
            url = URLs.baseUrl + 
                    URLs.frequency.list + '?' + 
                    URLs.frequency.countryParam + '=' + countryID;
        console.log('GET', url);
        fetch(url, {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then((response) => statusRouter(response, store.sessionActions.signOut))
        .then(chooseTextOrJSON)
        .then(function(payload){
            console.log('result', URLs.frequency.list, payload);
            let newState = parseFrequencies(payload);
            store.setState(newState);
        })
        .catch(function(e){
            console.log('parsing failed', e); // eslint-disable-line
        });
    }
}

export default FrequencyStore;
