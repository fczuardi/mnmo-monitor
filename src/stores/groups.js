import {Store} from 'flummox';
import URLs from '../../config/endpoints.js';
import {
    authHeaders,
    statusRouter,
    chooseTextOrJSON,
    parseGroups
} from '../../config/apiHelpers';
import partition from 'lodash/collection/partition';
import find from 'lodash/collection/find';

class GroupsStore extends Store {
    constructor(flux) {
        super();
        const sessionStore = flux.getStore('session');
        const sessionActions = flux.getActions('session');
        const userActions = flux.getActions('user');
        const groupsActions = flux.getActions('groups');
        this.sessionStore = sessionStore;
        this.sessionActions = sessionActions;
        this.flux = flux;
        this.register(userActions.preferencesFetched, this.userPreferencesFetched);
        this.register(groupsActions.changeGroupSelection, this.selectGroup);
        this.state = {
            type1: [],
            type2: [],
            selected: null
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
        .then((response) => statusRouter(response, store.sessionActions.signOut))
        .then(chooseTextOrJSON)
        .then(function(payload){
            console.log('result', URLs.filters.groups, payload);
            let groups = parseGroups(payload).groups,
                partitionedGroups = partition(groups, 'type', 1),
                userStore = store.flux.getStore('user');
            store.setState({
                type1: partitionedGroups[0],
                type2: partitionedGroups[1]
            });
            if (userStore.state.groupID !== null){
                store.selectGroup(userStore.state.groupID);
            }
        })
        .catch(function(e){
            console.log('parsing failed', e); // eslint-disable-line
        });
    }
    
    selectGroup(groupID) {
        let selected = find(
            this.state.type1.concat(this.state.type2), 
            'id', 
            groupID
        );
        console.log('selectGroup', groupID, selected);
        this.setState({
            selected: selected
        });
    }
}

export default GroupsStore;
