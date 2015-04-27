import {Store} from 'flummox';
import URLs from '../../config/endpoints.js';
import {
    authHeaders,
    chooseTextOrJSON,
    parseGroups
} from '../../config/apiHelpers';
import partition from 'lodash/collection/partition';

class GroupsStore extends Store {
    constructor(flux) {
        super();
        const sessionStore = flux.getStore('session');
        const userActions = flux.getActions('user');
        this.sessionStore = sessionStore;
        this.register(userActions.preferencesFetched, this.userPreferencesFetched);
        this.state = {
            type1: [],
            type2: []
        };
    }

    userPreferencesFetched() {
        this.fetchGroups();
    }
    
    fetchGroups(token) {
        let store = this;
        token = token || this.sessionStore.state.token;
        if (token === null){ return false; }
        console.log('GET', URLs.filters.groups);
        fetch(URLs.baseUrl + URLs.filters.groups, {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then(chooseTextOrJSON)
        .then(function(payload){
            console.log('result', URLs.filters.groups, payload);
            let groups = parseGroups(payload).groups,
                partitionedGroups = partition(groups, 'type', 1);
            store.setState({
                type1: partitionedGroups[0],
                type2: partitionedGroups[1]
            });
        })
        .catch(function(e){
            console.log('parsing failed', e); // eslint-disable-line
        });
    }
}

export default GroupsStore;
