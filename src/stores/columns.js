import {Store} from 'flummox';
import URLs from '../../config/endpoints.js';
import {
    authHeaders,
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
        const rowsActions = flux.getActions('rows');
        this.register(sessionActions.tokenGranted, this.fetchColumns);
        this.register(columnsActions.updateColumnSelectedState, this.updateSelection);
        this.register(userActions.preferencesPublished, this.userChanged);
        this.register(rowsActions.rowsFetchCompleted, this.replaceEnabledColumns);
        this.state = {
            enabled: [
            ],
            disabled: [
            ]
        };
        this.sessionStore = sessionStore;
        this.userStore = userStore;
        // this.fetchColumns(sessionStore.state.token);
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
    userChanged() {
        if (this.userStore.state.groupID !== this.previousSelectedGroup){
            console.log(this.userStore.state.groupID, this.previousSelectedGroup, 'fetch columns');
            this.fetchColumns(this.sessionStore.state.token);
            this.previousSelectedGroup = this.userStore.state.groupID;
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
        .then(chooseTextOrJSON)
        .then(function(payload){
            // console.log('result', payload);
            let columns = parseColumnsList(payload);
            // console.log('columns', columns);
            store.setState(columns);
        })
        .catch(function(e){
            console.log('parsing failed', e); // eslint-disable-line
        });
    }
    publishChanges() {
        let store = this,
            token = store.sessionStore.state.token,
            hasChanged = diffColumnsList(store.state),
            postBody = buildColumnsListPostBody(store.state);
        if (token === null){ return false; }
        if (hasChanged === false){ return false; }
        if (!postBody){ return false; }
        console.log('make post');
        // console.log(postBody);
        fetch(URLs.baseUrl + URLs.columns.list, {
            method: 'POST',
            headers: authHeaders(token),
            body: postBody
        })
        .then(chooseTextOrJSON)
        .then(function(payload){
            let response = columnListPostResponseOK(payload);
            console.log(response);
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
    replaceEnabledColumns(data) {
        let enabled = data.rows.columns;
        this.setState({
            enabled: enabled
        });
    }
}

export default ColumnsStore;
