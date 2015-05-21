import {Store} from 'flummox';
import merge from 'lodash/object/merge';
import pluck from 'lodash/collection/pluck';
import URLs from '../../config/endpoints.js';
import {
    authHeaders,
    statusRouter,
    chooseTextOrJSON,
    parseRows
} from '../../config/apiHelpers';

class RowsStore extends Store {
    constructor(flux) {
        super();
        const sessionStore = flux.getStore('session');
        const userStore = flux.getStore('user');
        const userActions = flux.getActions('user');
        const columnsStore = flux.getStore('columns');
        const columnsActions = flux.getActions('columns');
        const sessionActions = flux.getActions('session');
        const rowsActions = flux.getActions('rows');
        this.rowsActions = rowsActions;
        this.sessionStore = sessionStore;
        this.sessionActions = sessionActions;
        this.register(userActions.preferencesFetched, this.userPreferencesFetched);
        this.register(userActions.preferencesPublished, this.userChanged);
        this.register(columnsActions.columnsPublished, this.columnsChanged);
        this.register(columnsActions.columnsFetched, this.columnsFetched);
        // this.register(sessionActions.tokenGranted, this.fetchRows);
        this.register(rowsActions.rowsFetchCompleted, this.updateMenuLabel);
        this.register(rowsActions.rowsTypeSwitchClicked, this.updateRowsType);
        this.state = {
            type: 'list', // merged | list
            menuLabel: '…', //the little clock on the header
            headers: [], //row headers
            data: []
        };
        this.previousUserState = userStore.state;
        this.previousColumnsState = columnsStore.state;
    }

    userPreferencesFetched() {
        this.fetchRows();
    }
    
    userChanged(newState) {
        // console.log('userChanged', newState);
        let oldState = this.previousUserState;
        let needsRefetching = ( 
            (newState.autoUpdate !== oldState.autoUpdate) ||
            (newState.groupID !== oldState.groupID) ||
            (newState.classID !== oldState.classID) ||
            (newState.variableComboID !== oldState.variableComboID) ||
            (JSON.stringify(newState.archivedReport) !== 
                                    JSON.stringify(oldState.archivedReport) ) ||
            (JSON.stringify(newState.mergedRows) !== 
                                        JSON.stringify(oldState.mergedRows) )
        );
        if (needsRefetching) {
            // console.log('fetch rows again');
            this.fetchRows();
            this.previousUserState = merge({}, newState);
        }
    }
    
    columnsFetched(newState) {
        this.previousColumnsState = merge({}, newState);
    }
    
    columnsChanged(newState) {
        let newSequence = newState.enabled;
        let oldSequence = this.previousColumnsState.enabled;
        // console.log('columnsChanged', oldSequence, newSequence);
        let needsRefetching = ( 
            (newSequence.length > oldSequence.length) ||
            (
                pluck(newSequence, 'id').join(',') !== 
                pluck(oldSequence.slice(0, newSequence.length), 'id').join(',') 
            )
        );
        if (needsRefetching) {
            // console.log('fetch rows again');
            this.fetchRows();
        }
        this.previousColumnsState = merge({}, newState);
    }

    fetchRows(token, newType, endTime) {
        let store = this;
        let type = store.state.type;
        if (typeof newType === 'string'){
            type = newType;
        }
        token = token || store.sessionStore.state.token;
        if (token === null){ return false; }
        console.log('GET', type, URLs.rows[type]);
        endTime = endTime || '';
        let url = URLs.baseUrl + URLs.rows[type] + '?' + 
                        URLs.rows.endTimeParam + '=' + endTime;
        if (URLs.rows[type] === undefined){ return false; }
        fetch(url, {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then((response) => statusRouter(response, store.sessionActions.signOut))
        .then(chooseTextOrJSON)
        .then(function(payload){
            console.log('OK', URLs.rows[type]);
            // console.log('result', payload);
            // console.log('parsed result', parseRows(payload));
            store.rowsActions.rowsFetchCompleted(
                parseRows(payload)
            );
        })
        .catch(function(e){
            console.log('fetch error ' + URLs.rows[store.state.type], e); // eslint-disable-line
        });
    }
    
    updateMenuLabel(data) {
        let newLabel = data.rows.headers[0] ? data.rows.headers[0][0] : null;
        let rows = data.rows.data;
        this.setState({
            menuLabel: (newLabel || '-'),
            headers: data.rows.headers,
            data: rows
        });
    }
    
    updateRowsType(newType) {
        this.setState({
            menuLabel: '…',
            type: newType,
            headers: [],
            data: []
        });
        this.fetchRows(this.sessionStore.state.token, newType);
    }
}

export default RowsStore;
