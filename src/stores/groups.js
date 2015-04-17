import {Store} from 'flummox';
import URLs from '../../config/endpoints.js';
import {
    authHeaders,
    chooseTextOrJSON,
    parseGroups
} from '../../config/apiHelpers';

class GroupsStore extends Store {
    constructor(flux) {
        super();
        const sessionStore = flux.getStore('session');
        const sessionActions = flux.getActions('session');
        this.register(sessionActions.tokenGranted, this.fetchGroups);
        this.state = {
        };
        this.fetchGroups(sessionStore.state.token);
    }

    fetchGroups(token) {
        let store = this;
        if (token === null){ return false; }
        console.log('getGroups');
        fetch(URLs.baseUrl + URLs.rows.groups, {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then(chooseTextOrJSON)
        .then(function(payload){
            console.log('paylaod', payload);
            let groups = parseGroups(payload);
            console.log('groups:', groups);
        })
        .catch(function(e){
            console.log('parsing failed', e); // eslint-disable-line
        });
    }
}

export default GroupsStore;
