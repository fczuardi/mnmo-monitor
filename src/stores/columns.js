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
        const sessionActions = flux.getActions('session');
        const columnsActions = flux.getActions('columns');
        this.register(sessionActions.tokenGranted, this.fetchColumns);
        this.register(columnsActions.updateColumnSelectedState, this.updateSelection);
        this.state = {
            enabled: [
            ],
            disabled: [
            ]
        };
        this.sessionStore = sessionStore;
        this.fetchColumns(sessionStore.state.token);
        //columns state changed
        this.addListener('change', function(){
            this.savePreferences();
        });
    }
    savePreferences() {
        //post logged-user columns changes to the server
        this.publishChanges();
    }
    fetchColumns(token) {
        let store = this;
        if (token === null){ return false; }
        fetch(URLs.baseUrl + URLs.columns.list, {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then(chooseTextOrJSON)
        .then(function(payload){
            let columns = parseColumnsList(payload).columns,
                groupedColumns = partition(columns, 'enabled');
            store.setState({
                enabled: groupedColumns[0],
                disabled: sortBy(groupedColumns[1], 'label')
            });
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
        console.log(postBody);
        fetch(URLs.baseUrl + URLs.columns.list, {
            method: 'POST',
            headers: authHeaders(token),
            body: postBody
        })
        .then(chooseTextOrJSON)
        .then(function(payload){
            store.setState(columnListPostResponseOK(payload));
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
}

export default ColumnsStore;
