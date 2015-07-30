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
        const variablesStore = flux.getStore('columns');
        const columnsActions = flux.getActions('columns');
        const sessionActions = flux.getActions('session');
        const rowsActions = flux.getActions('rows');
        this.rowsActions = rowsActions;
        this.userActions = userActions;
        this.sessionStore = sessionStore;
        this.userStore = userStore;
        this.variablesStore = variablesStore;
        this.sessionActions = sessionActions;
        this.register(userActions.preferencesFetched, this.userPreferencesFetched);
        this.register(userActions.preferencesPublished, this.userChanged);
        this.register(userActions.tableScrollEnded, this.getNextPage);
        this.register(columnsActions.columnsPublished, this.columnsChanged);
        this.register(columnsActions.columnsFetched, this.columnsFetched);
        this.register(columnsActions.columnHeaderSelected, this.columnClicked);
        this.register(rowsActions.rowsFetchCompleted, this.updateMenuLabel);
        this.register(rowsActions.rowsTypeSwitchClicked, this.updateRowsType);
        this.register(rowsActions.fetchAgainRequested, this.tryAgain);
        this.state = {
            lastLoad: 0,
            type: 'list', // merged | list | detailed
            menuLabel: '…', //the little clock on the header
            headers: [], //row headers
            data: [],
            date: '',
            loading: true
        };
        this.previousUserState = userStore.state;
        this.previousColumnsState = columnsStore.state;
        this.autoUpdateInterval = undefined;
    }
    tryAgain(){
        this.userPreferencesFetched(this.userStore.state);
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
        let archivedReportIntervalChanged = (
                JSON.stringify(newState.archivedReport) !== 
                JSON.stringify(oldState.archivedReport) 
        );

        let needsRefetching = ( 
            (newState.autoUpdate !== oldState.autoUpdate) ||
            (newState.groupID !== oldState.groupID) ||
            (newState.classID !== oldState.classID) ||
            (newState.variableComboID !== oldState.variableComboID) ||
            archivedReportIntervalChanged ||
            (JSON.stringify(newState.mergedRows) !== 
                                        JSON.stringify(oldState.mergedRows) )
        );
        if (needsRefetching) {
            // console.log('fetch rows again');
            if (archivedReportIntervalChanged){
                this.resetRows();
            }
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
        console.log('GET', type, URLs.rows[type], endTime);
        
        endTime = endTime || '';

        if (
            endTime === '' &&
            ! store.userStore.state.autoUpdate &&
            store.userStore.state.archivedReport && 
            store.userStore.state.archivedReport.end
        ) {
            endTime = store.userStore.state.archivedReport.end.substring(0, 5);
        }
        // let url = URLs.baseUrl + URLs.rows.rowsError;
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
            console.log('result', payload);
            console.log('parsed result', parseRows(payload));
            let result = parseRows(payload, store.state.type);
            // console.log(result.rows.data.length +' rows');
            store.rowsActions.rowsFetchCompleted(result);
            if (result.error !== null) {
                store.userActions.errorArrived(result.error, 
                    store.rowsActions.fetchAgainRequested);
                store.stopAutoUpdate();
            } else {
                if (store.userStore.state.autoUpdate) {
                    store.startAutoUpdate();
                }
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
        // console.log('startAutoUpdate');
        let store = this;
        window.clearInterval(store.autoUpdateInterval);
        store.autoUpdateInterval = window.setInterval(function(){
            // console.log('autoupdate fetch');
            store.fetchRows();
        }, AUTOUPDATE_INTERVAL);
    }
    
    stopAutoUpdate() {
        // console.log('stopAutoUpdate');
        window.clearInterval(this.autoUpdateInterval);
    }
    
    getNextPage() {
        if (
            // (this.state.type === 'merged') ||
            // (this.userStore.state.autoUpdate !== true) ||
            ((this.state.type === 'merged') && (this.userStore.state.autoUpdate)) ||
            (this.state.headers.length === 0)
        ){
            return null; 
        }
        let lastHeader = this.state.headers[this.state.headers.length - 1],
            lastTime = lastHeader[0].split(' ')[0].substring(0, 5);
        // console.log('getNextPage', lastTime);
        this.fetchRows(this.sessionStore.state.token, this.state.type, lastTime);
    }
    
    TextToMinutes(text) {
        text = text || '00:00';
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
        
        let lastHeaderLabel = updatedHeaders[(updatedHeaders.length - 1)][0],
            firstNewHeaderLabel = newHeaders[0][0];

        if ((this.state.type === 'merged') && (this.userStore.state.autoUpdate)){
            if (newHeaders.length === 1){
                // console.log('replace first line');
                let oldHeadersTail = updatedHeaders.slice(1);
                let oldRowsTail = updatedRows.slice(1);
                return {
                    headers: newHeaders.concat(oldHeadersTail),
                    rows: newRows.concat(oldRowsTail)
                };
            } else {
                // console.log('replace the whole table');
                return {
                    headers: newHeaders,
                    rows: newRows
                };
            }
        }
        
        if (lastHeaderLabel.substring(0,2) === '00' && 
                firstNewHeaderLabel.substring(0,2) === '23') {
            console.log('Pagination occured right in between 00:00 and 23:59');
            lastHeaderLabel = lastHeaderLabel.replace('00:', '24:');
        }
        //if received first header (16:59) is close to last existing header (17:00)
        //this is a pagination, so append to the end of the list
        appendToEnd = (Math.abs(
            this.TextToMinutes(lastHeaderLabel) -
            this.TextToMinutes(firstNewHeaderLabel)
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
        // console.log('updateMenuLabel', data);
        if (data.rows === undefined || data.rows.data === null ||
            data.rows.data.length === 0 || 
            (data.rows.data.length === 1 && data.rows.data[0].length === 1 && data.rows.data[0][0] === null)
        ){
            console.log('no data');
            this.setState({
                lastLoad: new Date().getTime(),
                loading: false
            });
            return null;
        }
        let newRows = data.rows.data;
        let newHeaders = data.rows.headers;
        let mergedData = this.updateRows(newHeaders, newRows);
        // console.log('mergedData', mergedData.rows.length, mergedData.headers.length);
        let newLabel = mergedData.headers[0] ? mergedData.headers[0][0] : null;
        this.setState({
            menuLabel: (newLabel || '-'),
            headers: mergedData.headers,
            data: mergedData.rows,
            date: data.date,
            lastLoad: new Date().getTime(),
            loading: false
        });
    }
    
    updateRowsType(newType) {
        this.resetRows(newType);
        this.fetchRows(this.sessionStore.state.token, newType);
    }
    
    columnClicked(index) {
        if (this.state.type !== 'detailed') {
            this.updateRowsType('detailed');
        }
    }
}

export default RowsStore;
