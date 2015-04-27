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
        const sessionActions = flux.getActions('session');
        const rowsActions = flux.getActions('rows');
        this.rowsActions = rowsActions;
        this.register(sessionActions.tokenGranted, this.fetchRows);
        this.register(rowsActions.rowsFetchCompleted, this.updateMenuLabel);
        this.state = {
            type: 'list', // merged | list
            menuLabel: '…',
            headers: [],
            data: []
        };
        this.fetchRows(sessionStore.state.token);
    }

    fetchRows(token) {
        let store = this;
        if (token === null){ return false; }
        console.log('GET', URLs.rows[store.state.type]);
        fetch(URLs.baseUrl + URLs.rows[store.state.type], {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then(chooseTextOrJSON)
        .then(function(payload){
            console.log('result', URLs.rows[store.state.type], payload);
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
                                                    data.rows.groupedData;
        this.setState({
            menuLabel: newLabel,
            headers: data.rows.headers,
            data: rows
        });
    }
}

export default RowsStore;
