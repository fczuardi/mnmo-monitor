import {Store} from 'flummox';
import URLs from '../../config/endpoints.js';
import {
    authHeaders,
    statusRouter,
    chooseTextOrJSON,
    parseColumnsList,
    diffColumnsList,
    buildColumnsListPostBody,
    columnListPostResponseOK
} from '../../config/apiHelpers';
import partition from 'lodash/collection/partition';
import sortBy from 'lodash/collection/sortBy';

class ColumnsStore extends Store {
    constructor(flux) {
        super();
        const sessionStore = flux.getStore('session');
        const userStore = flux.getStore('user');
        const userActions = flux.getActions('user');
        const sessionActions = flux.getActions('session');
        const columnsActions = flux.getActions('columns');
        this.register(sessionActions.tokenGranted, this.fetchColumns);
        this.register(columnsActions.updateColumnSelectedState, this.updateSelection);
        this.register(columnsActions.columnsFetched, this.columnsFetched);
        this.register(userActions.preferencesPublished, this.userChanged);
        this.state = {
            enabled: [
            ],
            disabled: [
            ]
        };
        this.sessionStore = sessionStore;
        this.sessionActions = sessionActions;
        this.columnsActions = columnsActions;
        this.userStore = userStore;
        this.fetchColumns(sessionStore.state.token);
        //columns state changed
        this.addListener('change', function(){
            this.savePreferences();
        });
        this.previousSelectedGroup = userStore.state.groupID;
    }
    savePreferences() {
        //post logged-user columns changes to the server
        this.publishChanges();
    }
    userChanged(newState) {
        if (newState.groupID !== this.previousSelectedGroup){
            this.fetchColumns(this.sessionStore.state.token);
            this.previousSelectedGroup = newState.groupID;
        }
    }
    fetchColumns(token) {
        let store = this;
        if (token === null){ return false; }
        console.log('GET', URLs.columns.list);
        fetch(URLs.baseUrl + URLs.columns.list, {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then((response) => statusRouter(response, store.sessionActions.signOut))
        .then(chooseTextOrJSON)
        .then(function(payload){
            // console.log('result', URLs.columns.list, payload);
            console.log('OK', URLs.columns.list);
            let columns = parseColumnsList(payload);
            store.columnsActions.columnsFetched(columns);
        })
        .catch(function(e){
            console.log('fetch error', e); // eslint-disable-line
        });
    }
    columnsFetched(columns) {
        this.setState(columns);
    }
    publishChanges() {
        let store = this,
            token = store.sessionStore.state.token,
            hasChanged = diffColumnsList(store.state),
            postBody = buildColumnsListPostBody(store.state);
        if (token === null){ return false; }
        if (hasChanged === false){ return false; }
        if (!postBody){ return false; }
        console.log('POST', URLs.columns.list);
        fetch(URLs.baseUrl + URLs.columns.list, {
            method: 'POST',
            headers: authHeaders(token),
            body: postBody
        })
        .then((response) => statusRouter(response, store.sessionActions.signOut))
        .then(chooseTextOrJSON)
        .then(function(payload){
            // let response = columnListPostResponseOK(payload);
            // console.log('result (post)', URLs.columns.list, response);
            let newState = columnListPostResponseOK(payload);
            console.log('OK (post)', URLs.columns.list);
            store.columnsActions.columnsPublished(newState);
        })
        .catch(function(e){
            console.log('parsing failed', e); // eslint-disable-line
        });
        
    }
    updateSelection(obj) {
        let groupToInclude = (obj.checked === true) ? 
                                this.state.enabled : this.state.disabled,
            groupToExclude = (obj.checked === true) ? 
                                this.state.disabled : this.state.enabled,
            partitionedGroup = partition(
                groupToExclude, 'id', parseInt(obj.columnID)
            );
        if (obj.checked === true){
            this.setState({
                enabled: groupToInclude.concat(partitionedGroup[0]),
                disabled: partitionedGroup[1]
            });
        } else {
            this.setState({
                enabled: partitionedGroup[1],
                disabled: sortBy(groupToInclude.concat(partitionedGroup[0]), 'label')
            });
        }
    }
    // replaceEnabledColumns(data) {
    //     let enabled = data.rows.columns;
    //     this.setState({
    //         enabled: enabled
    //     });
    // }
}

export default ColumnsStore;
