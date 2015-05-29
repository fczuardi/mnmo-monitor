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

const AUTOUPDATE_INTERVAL = 1000 * 30;

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
        this.userActions = userActions;
        this.sessionStore = sessionStore;
        this.userStore = userStore;
        this.sessionActions = sessionActions;
        this.register(userActions.preferencesFetched, this.userPreferencesFetched);
        this.register(userActions.preferencesPublished, this.userChanged);
        this.register(userActions.tableScrollEnded, this.getNextPage);
        this.register(columnsActions.columnsPublished, this.columnsChanged);
        this.register(columnsActions.columnsFetched, this.columnsFetched);
        this.register(rowsActions.rowsFetchCompleted, this.updateMenuLabel);
        this.register(rowsActions.rowsTypeSwitchClicked, this.updateRowsType);
        this.state = {
            lastLoad: 0,
            type: 'list', // merged | list
            menuLabel: '…', //the little clock on the header
            headers: [], //row headers
            data: [],
            loading: true
        };
        this.previousUserState = userStore.state;
        this.previousColumnsState = columnsStore.state;
        this.autoUpdateInterval = undefined;
    }
    userPreferencesFetched(pref) {
        this.resetRows();
        this.fetchRows();
        this.toggleAutoUpdate(pref.autoUpdate);
    }
    
    toggleAutoUpdate(autoUpdate) {
        if (autoUpdate){
            this.startAutoUpdate();
        } else {
            this.stopAutoUpdate();
        }
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
            this.resetRows();
            this.fetchRows();
            this.previousUserState = merge({}, newState);
            this.toggleAutoUpdate(newState.autoUpdate);
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
            this.resetRows();
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
        store.setState({
            loading: true
        });
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
            let result = parseRows(payload);
            store.rowsActions.rowsFetchCompleted(result);
            if (result.error !== null) {
                store.userActions.errorArrived(result.error);
            }
        })
        .catch(function(e){
            console.log('fetch error ' + URLs.rows[store.state.type], e); // eslint-disable-line
            store.setState({
                loading: false
            });
        });
    }
    
    resetRows(newType) {
        let type = newType || this.state.type;
        this.setState({
            menuLabel: '…',
            type: type,
            headers: [],
            data: [],
            lastLoad: new Date().getTime()
        });
    }
    
    startAutoUpdate() {
        console.log('startAutoUpdate');
        let store = this;
        store.autoUpdateInterval = window.setInterval(function(){
            console.log('autoupdate fetch');
            store.fetchRows();
        }, AUTOUPDATE_INTERVAL);
    }
    
    stopAutoUpdate() {
        console.log('stopAutoUpdate');
        window.clearInterval(this.autoUpdateInterval);
    }
    
    getNextPage() {
        if (
            (this.state.headers.length === 0) || 
            (this.state.type === 'merged') ||
            (this.userStore.state.autoUpdate !== true)
        ){ 
            return null; 
        }
        let lastHeader = this.state.headers[this.state.headers.length - 1],
            lastTime = lastHeader[0].split(' ')[0];
        console.log('getNextPage', lastTime);
        this.fetchRows(this.sessionStore.state.token, this.state.type, lastTime);
    }
    
    TextToMinutes(text) {
        let timeParts = text.split(':');
        return parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
    }
    updateRows(newHeaders, newRows) {
        let shouldReplaceTable = (this.state.data.length === 0),
            mergedData = {
                headers: newHeaders,
                rows: newRows
            };
        if (shouldReplaceTable){
            return mergedData;
        }
        
        //code for updating existing table goes here
        // console.log('update table instead of replacing it');
        let oldHeaderIndexes = {},
            headersToAdd = [],
            rowsToAdd = [],
            updatedRows = this.state.data.slice(0),
            updatedHeaders = this.state.headers.slice(0),
            appendToEnd = false;
        updatedHeaders.forEach( (header, index) => {
            oldHeaderIndexes[header[0]] = index;
        });
        
        //if received first header (16:59) is close to last existing header (17:00)
        //this is a pagination, so append to the end of the list
        appendToEnd = (Math.abs(
            this.TextToMinutes(updatedHeaders[(updatedHeaders.length - 1)][0]) -
            this.TextToMinutes(newHeaders[0][0])
            ) < 5);

        // console.log('oldHeaderIndexes', oldHeaderIndexes);
        newHeaders.forEach( (header, index) => {
            let oldRowIndex = oldHeaderIndexes[header[0]];
            if (oldRowIndex === undefined) {
                // console.log('new row', newRows[index]);
                rowsToAdd.push(newRows[index]);
                headersToAdd.push(newHeaders[index]);
            } else if (
                (updatedRows[oldRowIndex].join(',') !== newRows[index].join(',')) ||
                (updatedHeaders[oldRowIndex].join(',') !== newHeaders[index].join(','))
            ){
                // console.log('row to update', updatedRows[oldRowIndex], newRows[index]);
                updatedHeaders[oldRowIndex] = newHeaders[index];
                updatedRows[oldRowIndex] = newRows[index];
            } else {
                // console.log('same row');
            }
        });
        return {
            headers: appendToEnd ? updatedHeaders.concat(headersToAdd) : 
                                    headersToAdd.concat(updatedHeaders),
            rows: appendToEnd ? updatedRows.concat(rowsToAdd) : 
                                    rowsToAdd.concat(updatedRows)
        };
    }
    
    updateMenuLabel(data) {
        let newRows = data.rows.data;
        let newHeaders = data.rows.headers;
        let mergedData = this.updateRows(newHeaders, newRows);
        let newLabel = mergedData.headers[0] ? mergedData.headers[0][0] : null;
        this.setState({
            menuLabel: (newLabel || '-'),
            headers: mergedData.headers,
            data: mergedData.rows,
            lastLoad: new Date().getTime(),
            loading: false
        });
    }
    
    updateRowsType(newType) {
        this.resetRows(newType);
        this.fetchRows(this.sessionStore.state.token, newType);
    }
}

export default RowsStore;
