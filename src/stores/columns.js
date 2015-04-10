import {Store} from 'flummox';
import URLs from '../../config/endpoints.js';
import {
    authHeaders,
    chooseTextOrJSON,
    parseColumnsList
} from '../../config/apiHelpers';
import partition from 'lodash/collection/partition';
import sortBy from 'lodash/collection/sortBy';

class ColumnsStore extends Store {
    constructor(flux) {
        super();
        const sessionStore = flux.getStore('session');
        const sessionActions = flux.getActions('session');
        this.register(sessionActions.tokenGranted, this.fetchColumns);
        this.state = {
            enabled: [
            ],
            disabled: [
            ]
        };
        this.fetchColumns(sessionStore.state.token);
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
            let columns = parseColumnsList(payload),
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
}

export default ColumnsStore;
