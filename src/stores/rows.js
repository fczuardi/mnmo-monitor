import {Store} from 'flummox';
import queryString from 'query-string';
import merge from 'lodash/object/merge';
import pluck from 'lodash/collection/pluck';
import URLs from '../../config/endpoints.js';
import {
    authHeaders,
    statusRouter,
    chooseTextOrJSON,
    parseRows,
    parseSecondaryRows,
    secondTablePostResponseOK
} from '../../config/apiHelpers';
import {
    DOM,
    createElement,
    renderToStaticMarkup
} from 'react';

import SimpleTable from '../components/simpledatatable';

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
        this.flux = flux;
        this.rowsActions = rowsActions;
        this.userActions = userActions;
        this.sessionStore = sessionStore;
        this.userStore = userStore;
        this.variablesStore = variablesStore;
        this.sessionActions = sessionActions;
        this.register(userActions.preferencesFetched, this.userPreferencesFetched);
        this.register(userActions.preferencesPublished, this.userChanged);
        this.register(userActions.tableScrollEnded, this.getNextPage);
        this.register(userActions.printRequested, this.printTable);
        this.register(userActions.secondTableEnabled, this.fetchSecondaryRows);
        this.register(userActions.secondTableFormChanged, this.secondTableFormUpdate);
        this.register(columnsActions.columnsPublished, this.columnsChanged);
        this.register(columnsActions.columnsFetched, this.columnsFetched);
        this.register(columnsActions.columnHeaderSelected, this.columnClicked);
        this.register(rowsActions.rowsFetchCompleted, this.updateMenuLabel);
        this.register(rowsActions.rowsTypeSwitchClicked, this.updateRowsType);
        this.register(rowsActions.fetchAgainRequested, this.tryAgain);
        this.register(rowsActions.secondaryRowsFetchCompleted, this.updateSecondTable);
        this.register(rowsActions.secondTableAddFormSubmitted, this.addSecondaryRow);
        this.state = {
            lastLoad: 0,
            type: 'list', // merged | list | detailed
            menuLabel: '…', //the little clock on the header
            headers: [], //row headers
            data: [],
            columns: [],
            date: '',
            loading: true,
            //second table (comparative)
            secondary: {
                autoUpdate: false,
                loading: true,
                lastLoad: 0,
                headers: [],
                columns: [],
                data: []
            }
        };
        this.previousUserState = userStore.state;
        this.autoUpdateStatusChanged = false;
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
                ( JSON.stringify(newState.archivedReport) !==
                    JSON.stringify(oldState.archivedReport) ) ||
                ( JSON.stringify(newState.mergedRows) !==
                    JSON.stringify(oldState.mergedRows) )
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
        this.autoUpdateStatusChanged = (newState.autoUpdate !== oldState.autoUpdate);
        if (needsRefetching) {
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

    fetchSecondaryRows(dayParam) {
        let store = this;
        let token = store.sessionStore.state.token;
        dayParam = dayParam || '';
        //reset rows
        let secondaryObj = merge({}, this.state.secondary);
        secondaryObj.loading = true;
        this.setState({
            secondary: secondaryObj
        });
        let url = URLs.baseUrl + URLs.rows.secondTable + '?';
        url += URLs.rows.secondTableDayParam + '=' + dayParam;
        fetch(url, {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then((response) => statusRouter(response, store.sessionActions.signOut))
        .then(chooseTextOrJSON)
        .then(function(payload){
            console.log('OK', URLs.rows.secondTable);
            console.log('result', payload);
            let result = parseSecondaryRows(payload);
            console.log('parsed result', result);
            store.rowsActions.secondaryRowsFetchCompleted(result.rows);
        })
        .catch(function(e){
            console.log('fetch error ' + URLs.rows.secondTable, e); // eslint-disable-line
        });
    }
    updateSecondTable(data){
        console.log('updateSecondTable', data);
        let newValues = merge({}, this.state.secondary);
        //overwrite rows and headers
        newValues.headers = data.headers;
        newValues.data = data.data;
        newValues.lastLoad = new Date().getTime();
        newValues.loading = false;
        newValues.autoUpdate = data.autoUpdate;
        console.log('newValues', newValues);
        this.setState({
            secondary: newValues
        });
    }
    modifySecondaryTable(params){
        let store = this;
        let token = store.sessionStore.state.token;
        let url = URLs.baseUrl + URLs.rows.secondTable;
        let postBody = {};

        let postHeaders = authHeaders(token, true);
        postBody[URLs.rows.secondTableAutoupdateParam] = params.autoUpdate;
        if (params.autoUpdate === false){
            postBody[URLs.rows.secondTableActionParam] = params.action == 'add' ?
                                            URLs.rows.secondTableAddActionValue :
                                            URLs.rows.secondTableRemoveActionValue;
            postBody[URLs.rows.secondTableDayPostParam] = params.day;
            postBody[URLs.rows.secondTableStartTimeParam] = params.startTime;
            postBody[URLs.rows.secondTableEndTimeParam] = params.endTime;
            postBody[URLs.rows.secondTableVariableParam] = params.variableComboID;
        }
        postBody = queryString.stringify(postBody);
        console.log('---------');
        console.log('modifySecondaryTable POST body', postBody, postHeaders);
        console.log('---------');


        fetch(url, {
            method: 'POST',
            headers: postHeaders,
            body: postBody
        })
        .then((response) => statusRouter(
            response,
            store.sessionActions.signOut
        ))
        .then(chooseTextOrJSON)
        .then(function(payload){
            console.log('OK (post)', URLs.rows.secondTableAutoupdateParam);
            console.log('result (post)', URLs.rows.secondTableAutoupdateParam, payload);
            let result = secondTablePostResponseOK(payload);
            if (result.error !== null) {
                store.userActions.errorArrived(result.error);
            } else if (result.success){
                store.fetchSecondaryRows();
            }
        })
        .catch(function(e){
            console.log('parsing failed ' + URLs.rows.secondTableAutoupdateParam, e); // eslint-disable-line
        });

    }
    addSecondaryRow(){
        let params = {
            action: 'add',
            day: this.userStore.state.newSecondaryRow.day,
            startTime: this.userStore.state.newSecondaryRow.startTime,
            endTime: this.userStore.state.newSecondaryRow.endTime,
            variableComboID: this.userStore.state.newSecondaryRow.variableComboID,
            autoUpdate: false
        }
        console.log('addSecondaryRow', params);
        this.modifySecondaryTable(params);
    }

    secondTableFormUpdate(change){
        let secondary = merge({}, this.state.secondary);
        switch (change.field){
            case 'autoUpdate':
                secondary.autoUpdate = !secondary.autoUpdate;
                if (secondary.autoUpdate === true){
                    // User changed secondary table autoupdate to true
                    // make post request passing autoUpdate parameter
                    this.modifySecondaryTable({
                        autoUpdate: true
                    });
                } else {
                    // User changed secondary table autoupdate to false
                    // clear secondary table
                    secondary.loading = false;
                    secondary.lastLoad = new Date().getTime();
                    secondary.headers = [];
                    secondary.columns = [];
                    secondary.data = [];
                }
                this.setState({ secondary: secondary});
                break;
            case 'action':
                if (!secondary.autoUpdate){
                    this.addSecondaryRow();
                } else {
                    //example: '2015-10-09 06:00'
                    this.fetchSecondaryRows(
                        this.userStore.state.newSecondaryRow.day + ' ' +
                        this.userStore.state.newSecondaryRow.startTime
                    );
                }
                break;
            default:
                break;
        }
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
            let result = parseRows(payload, store.state.type);
            console.log('parsed result', result);
            console.log(result.rows.data.length +' rows');
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

    resetSecondaryRows(){

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

    //merge new loaded rows into the existing table already in memory
    updateRows(newHeaders, newRows) {
        let shouldReplaceTable = (this.state.data.length === 0 || this.autoUpdateStatusChanged),
            mergedData = {
                headers: newHeaders,
                rows: newRows
            };
        this.autoUpdateStatusChanged = false;
        if (shouldReplaceTable){
            // console.log('replace data');
            return mergedData;
        }

        //code for updating existing table goes here
        let calendarStore = this.flux.getStore('calendar');

        let oldHeaderIndexes = {},
            headersToAdd = [],
            rowsToAdd = [],
            updatedRows = this.state.data.slice(0),
            updatedHeaders = this.state.headers.slice(0),
            appendToEnd = false;
        updatedHeaders.forEach( (header, index) => {
            oldHeaderIndexes[header[0]] = index;
        });

        let firstHeaderLabel = updatedHeaders[0][0],
            lastHeaderLabel = updatedHeaders[(updatedHeaders.length - 1)][0],
            firstNewHeaderLabel = newHeaders[0][0];

        let dayChanged = (
            (firstHeaderLabel.substring(0,5) ===
                calendarStore.state.lastMinute.substring(0,5)) &&
            (firstNewHeaderLabel.substring(0,5) ===
                calendarStore.state.firstMinute.substring(0,5))
        );
        // let dayChanged = (
        //     (firstHeaderLabel.substring(0,5) ===
        //         '06:07') &&
        //     (firstNewHeaderLabel.substring(0,5) ===
        //         '06:08')
        // );
        // console.log('compare',firstHeaderLabel.substring(0,5), 'with',
        //             calendarStore.state.lastMinute.substring(0,5), 'and',
        //             firstNewHeaderLabel.substring(0,5), 'with',
        //             calendarStore.state.firstMinute.substring(0,5), dayChanged);
        if (dayChanged){
            // console.log('replace data');
            return mergedData;
        }


        // console.log('update table instead of replacing it');

        //maybe revisit this code block if the API result for type merged
        //starts returning just parts of the table instead of all minutes
        if ((this.state.type === 'merged') && (this.userStore.state.autoUpdate)){
            //sometimes tha api returns only one line,
            //when that happens the first row should be the only one replaced
            //and the remaining rows maintained
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

    getColumnsFromRows(rows){
        // console.log('getColumnsFromRows r', rows);
        let firstRowCells = rows[0] ? rows[0] : [];
        let columns = firstRowCells.map( () => ([]) );
        for (var r = 0; r < rows.length; r += 1){
            let row = rows[r];
            if (row === undefined) {
                break;
            }
            row.forEach( (cell, index) => {
                let value = cell;
                if (Array.isArray(columns[index])){
                    columns[index].push(value);
                }
            });
        }
        // console.log('getColumnsFromRows', columns);
        return columns;
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
        let columns = this.getColumnsFromRows(mergedData.rows);
        // console.log('mergedData', mergedData.rows.length, mergedData.headers.length);
        let newLabel = mergedData.headers[0] ? mergedData.headers[0][0] : null;
        this.setState({
            menuLabel: (newLabel || '-'),
            headers: mergedData.headers,
            data: mergedData.rows,
            columns: columns,
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

    printTable(){
        console.log('printTable');

        let tableProperties = {
            flux: this.flux,
            // groups: this.flux.getStore('groups').state,
            vars: this.flux.getStore('vars').state,
            // user: this.flux.getStore('user').state,
            // language: this.flux.getStore('language').state,
            columns: this.flux.getStore('columns').state,
            rows: this.state,
            iconWidth: 30
            // ui: this.flux.getStore('ui').state
        };
        let tableHTML = renderToStaticMarkup(
            DOM.html(null,
                DOM.head(null,
                    DOM.link({
                        href: './css/main.css',
                        rel: 'stylesheet'
                    })
                ),
                DOM.body(null,
                    createElement(SimpleTable, tableProperties),
                    DOM.script(null,
                        'window.print();'
                    )
                )
            )
        );
        // console.log(tableHTML);
        let printWindow = window.open('', 'printWindow', 'scrollbars=yes');
        printWindow.document.write(tableHTML);
    }
}

export default RowsStore;
