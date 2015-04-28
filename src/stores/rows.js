import {Store} from 'flummox';
import URLs from '../../config/endpoints.js';
import {
    authHeaders,
    chooseTextOrJSON,
    parseRows
} from '../../config/apiHelpers';

class RowsStore extends Store {
    constructor(flux) {
        super();
        const sessionStore = flux.getStore('session');
        const userActions = flux.getActions('user');
        const sessionActions = flux.getActions('session');
        const rowsActions = flux.getActions('rows');
        this.rowsActions = rowsActions;
        this.sessionStore = sessionStore;
        this.register(userActions.preferencesFetched, this.userPreferencesFetched);
        this.register(sessionActions.tokenGranted, this.fetchRows);
        this.register(rowsActions.rowsFetchCompleted, this.updateMenuLabel);
        this.register(rowsActions.rowsTypeSwitchClicked, this.updateRowsType);
        this.state = {
            type: 'list', // merged | list
            menuLabel: '…',
            headers: [],
            data: []
        };
    }

    userPreferencesFetched() {
        this.fetchRows();
    }

    fetchRows(token, newType) {
        let store = this;
        let type = store.state.type;
        if (typeof newType === 'string'){
            type = newType;
        }
        token = token || store.sessionStore.state.token;
        if (token === null){ return false; }
        console.log('GET rows', type, URLs.rows[type]);
        if (URLs.rows[type] === undefined){ return false; }
        fetch(URLs.baseUrl + URLs.rows[type], {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then(chooseTextOrJSON)
        .then(function(payload){
            console.log('result', URLs.rows[type], payload);
            store.rowsActions.rowsFetchCompleted(
                parseRows(payload)
            );
        })
        .catch(function(e){
            console.log('parsing failed', e); // eslint-disable-line
        });
    }
    
    updateMenuLabel(data) {
        let newLabel = data.rows.headers[0][0];
        let rows = (this.state.type === 'list') ? 
                                            data.rows.data : 
                                            data.rows.mergedData;
        this.setState({
            menuLabel: newLabel,
            headers: data.rows.headers,
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
