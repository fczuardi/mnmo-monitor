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
            type1: [
                {
                    "id": 1,
                    "label": "GROUP A",
                    "shortLabel": "GRA",
                    "type": 1
                },
                {
                    "id": 2,
                    "label": "GROUP B",
                    "shortLabel": "GRB",
                    "type": 1
                }
            ],
            type2: [
                {
                    "id": 3,
                    "label": "GROUP C",
                    "shortLabel": "GRC",
                    "type": 2
                }
            ]
        };
        this.fetchGroups(sessionStore.state.token);
    }

    fetchGroups(token) {
        let store = this;
        if (token === null){ return false; }
        console.log('getGroups');
        fetch(URLs.baseUrl + URLs.filters.groups, {
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
