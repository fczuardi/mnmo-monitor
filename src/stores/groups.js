import {Store} from 'flummox';
import merge from 'lodash/object/merge';
import URLs from '../../config/endpoints.js';
import {
    authHeaders,
    statusRouter,
    chooseTextOrJSON,
    parseGroups,
    parseSubGroups
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
        this.register(userActions.preferencesPublished, this.userPreferencesPublished);
        this.register(groupsActions.changeGroupSelection, this.selectGroup);
        this.state = {
            type1: [],
            type2: [],
            selected: null,
            selectedGroupSubgroups: []
        };
        this.previousUserState = {groupID: null};
    }

    userPreferencesFetched(preferences) {
        this.fetchGroups();
        this.previousUserState = merge({}, preferences);
    }

    userPreferencesPublished(newState) {
        let needsRefetching = (
            (this.state.selected !== null) &&
            (this.state.selected.subgroupsCount > 0) &&
            (newState.groupID !== this.previousUserState.groupID)
        );
        if (needsRefetching) {
            this.fetchSubGroups();
            this.previousUserState = merge({}, newState);
        }
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
            // console.log('result', URLs.filters.groups, payload);
            console.log('OK', URLs.filters.groups);
            let groups = parseGroups(payload).groups,
                partitionedGroups = partition(groups, 'type', 1),
                userStore = store.flux.getStore('user');
            store.setState({
                type1: partitionedGroups[0],
                type2: partitionedGroups[1]
            });
            if (userStore.state.groupID !== null){
                // console.log('selectgroupID ',userStore.state.groupID);
                store.selectGroup(userStore.state.groupID, true);
            }
        })
        .catch(function(e){
            console.log('fetch error ' + URLs.filters.groups, e); // eslint-disable-line
        });
    }
    
    fetchSubGroups(token) {
        let store = this;
        token = token || this.sessionStore.state.token;
        if (token === null){ return false; }
        console.log('GET', URLs.filters.subgroups);
        fetch(URLs.baseUrl + URLs.filters.subgroups, {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then((response) => statusRouter(response, store.sessionActions.signOut))
        .then(chooseTextOrJSON)
        .then(function(payload){
            // console.log('result', URLs.filters.subgroups, payload);
            console.log('OK', URLs.filters.subgroups);
            let groups = parseSubGroups(payload).groups;
            store.setState({
                selectedGroupSubgroups: groups
            });
        })
        .catch(function(e){
            console.log('fetch error ' + URLs.filters.subgroups, e); // eslint-disable-line
        });
    }

    selectGroup(groupID, fetchSubGroups) {
        let selected = find(
            this.state.type1.concat(this.state.type2), 
            'id', 
            groupID
        );
        this.setState({
            selected: selected
        });
        if (fetchSubGroups === true && selected.subgroupsCount > 0) {
            this.fetchSubGroups();
        }
    }
}

export default GroupsStore;
