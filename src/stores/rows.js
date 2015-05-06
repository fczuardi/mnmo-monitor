import {Store} from 'flummox';
import merge from 'lodash/object/merge';
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
        const sessionActions = flux.getActions('session');
        const rowsActions = flux.getActions('rows');
        this.rowsActions = rowsActions;
        this.sessionStore = sessionStore;
        this.sessionActions = sessionActions;
        this.register(userActions.preferencesFetched, this.userPreferencesFetched);
        this.register(userActions.preferencesPublished, this.userChanged);
        // this.register(sessionActions.tokenGranted, this.fetchRows);
        this.register(rowsActions.rowsFetchCompleted, this.updateMenuLabel);
        this.register(rowsActions.rowsTypeSwitchClicked, this.updateRowsType);
        this.state = {
            type: 'list', // merged | list
            menuLabel: '…', //the little clock on the header
            headers: [], //row headers
            columns: [], //column headers
            data: []
        };
        this.previousUserState = userStore.state;
    }

    userPreferencesFetched() {
        this.fetchRows();
    }
    userChanged(newState) {
        console.log('userChanged', newState);
        let oldState = this.previousUserState;
        let needsRefetching = ( 
            (newState.groupID !== oldState.groupID) ||
            (newState.classID !== oldState.classID) ||
            (newState.variableComboID !== oldState.variableComboID) ||
            (JSON.stringify(newState.archivedReport) !== 
                                    JSON.stringify(oldState.archivedReport) ) ||
            (JSON.stringify(newState.mergedRows) !== 
                                        JSON.stringify(oldState.mergedRows) )
        );
        if (needsRefetching) {
            console.log('fetch rows again');
            this.fetchRows();
            this.previousUserState = merge({}, newState);
        }
    }

    fetchRows(token, newType) {
        let store = this;
        let type = store.state.type;
        if (typeof newType === 'string'){
            type = newType;
        }
        token = token || store.sessionStore.state.token;
        if (token === null){ return false; }
        console.log('GET', type, URLs.rows[type]);
        if (URLs.rows[type] === undefined){ return false; }
        fetch(URLs.baseUrl + URLs.rows[type], {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then((response) => statusRouter(response, store.sessionActions.signOut))
        .then(chooseTextOrJSON)
        .then(function(payload){
            // console.log('result', URLs.rows[type], payload);
            console.log('OK', URLs.rows[type]);
            store.rowsActions.rowsFetchCompleted(
                parseRows(payload)
            );
        })
        .catch(function(e){
            console.log('fetch error', e); // eslint-disable-line
        });
    }
    
    updateMenuLabel(data) {
        let newLabel = data.rows.headers[0] ? data.rows.headers[0][0] : null;
        let rows = (this.state.type === 'list') ? 
                                            data.rows.data : 
                                            data.rows.mergedData;
        this.setState({
            menuLabel: newLabel,
            headers: data.rows.headers,
            columns: data.rows.columns,
            data: rows
        });
    }
    
    updateRowsType(newType) {
        this.setState({
            type: newType,
            headers: [
                ['…']
            ],
            data: [
                ['']
            ]
        });
        this.fetchRows(this.sessionStore.state.token, newType);
    }
}

export default RowsStore;
