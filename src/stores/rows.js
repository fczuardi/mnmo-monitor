import {Store} from 'flummox';
import queryString from 'query-string';
import merge from 'lodash/object/merge';
import find from 'lodash/collection/find';
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
        const calendarStore = flux.getStore('calendar');
        const userActions = flux.getActions('user');
        const columnsStore = flux.getStore('columns');
        const variablesStore = flux.getStore('vars');
        const columnsActions = flux.getActions('columns');
        const sessionActions = flux.getActions('session');
        const rowsActions = flux.getActions('rows');
        this.flux = flux;
        this.rowsActions = rowsActions;
        this.userActions = userActions;
        this.sessionStore = sessionStore;
        this.userStore = userStore;
        this.calendarStore = calendarStore;
        this.variablesStore = variablesStore;
        this.columnsStore = columnsStore;
        this.sessionActions = sessionActions;
        this.register(sessionActions.refreshDataLoaded, this.overrideDefaults);
        this.register(userActions.preferencesFetched, this.userPreferencesFetched);
        this.register(userActions.preferencesPublished, this.userChanged);
        this.register(userActions.tableScrollEnded, this.getNextPage);
        this.register(userActions.clearPrintInterval, this.clearPrintInterval);
        this.register(userActions.setPrintInterval, this.setPrintInterval);
        this.register(userActions.setPrintStartHour, this.setPrintStartHour);
        this.register(userActions.setPrintEndHour, this.setPrintEndHour);
        this.register(userActions.setPrintStartMinute, this.setPrintStartMinute);
        this.register(userActions.setPrintEndMinute, this.setPrintEndMinute);
        this.register(userActions.printIntervalRequested, this.fetchPrintRows);
        this.register(userActions.printRequested, this.printTable);
        this.register(userActions.secondTableEnabled, this.fetchSecondaryRows);
        this.register(userActions.secondTableFormChanged, this.secondTableFormUpdate);
        this.register(columnsActions.columnsPublished, this.columnsChanged);
        this.register(columnsActions.columnsFetched, this.columnsFetched);
        this.register(columnsActions.columnHeaderSelected, this.columnClicked);
        this.register(columnsActions.columnMoved, this.columnMoved);
        this.register(columnsActions.updateColumnSelectedState, this.columnSelectionChange);
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
            lastEndTime: '',
            nonBlockingErrorMessage: null,
            //second table (comparative)
            secondary: {
                autoUpdate: false,
                loading: true,
                lastLoad: 0,
                headers: [],
                columns: [],
                data: []
            },
            // print table (when in minutes list, user can setup a different
            // interval for the printed table)
            printInterval: {
                date: null, //2016-09-22
                start: null,
                end: null
            },
            printTableLoading: false,
            printTable: {
                data: [],
                headers: []
            }
        };
        this.previousUserState = userStore.state;
        this.autoUpdateStatusChanged = false;
        this.previousColumnsState = columnsStore.state;
        this.autoUpdateInterval = undefined;
        this.secondaryAutoUpdateInterval = undefined;
    }
    overrideDefaults(refreshData){
        // console.log('overrideDefaults rows', refreshData);
        if (!refreshData){
            return null
        }
        let secondaryDefault = {
            autoUpdate: false,
            loading: true,
            lastLoad: 0,
            headers: [],
            columns: [],
            data: []
        }
        this.setState({
            type: refreshData.rows.type || 'list',
            secondary: refreshData.rows.secondary || secondaryDefault,
        });
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
            this.fetchRows(null, null, null, true);
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
            this.fetchRows(null, null, null, true);
        }
        this.previousColumnsState = merge({}, newState);
    }
    clearPrintInterval() {
        this.setState({
            printInterval: {
                date: null,
                start: this.calendarStore.state.firstMinute,
                end: this.calendarStore.state.lastMinute
            },
            printTable: { data: [], headers: [] }
        });
    }
    setPrintInterval() {
        if (this.userStore.state.autoUpdate){
            let start = this.state.headers[(this.state.headers.length - 1)][0];
            let end = this.state.headers[0][0];
            let newState = {
                date: this.state.date,
                start: start,
                end: end
            };
            this.setState({ printInterval: newState })
        } else {
            this.setState({ printInterval: this.userStore.state.archivedReport })
        }
    }
    setPrintStartHour(h) {
        let startParts = this.state.printInterval.start.split(':');
        let newStart = [h].concat(startParts.slice(1));
        let start = newStart.join(':');
        this.setState({
            printInterval: {
                date: this.state.printInterval.date,
                start: start,
                end: this.state.printInterval.end
            },
            printTable: { data: [], headers: [] }
        })
    }
    setPrintStartMinute(m) {
        let startParts = this.state.printInterval.start.split(':');
        let newStart = [startParts[0]].concat([m]);
        let start = newStart.join(':');
        this.setState({
            printInterval: {
                date: this.state.printInterval.date,
                start: start,
                end: this.state.printInterval.end
            },
            printTable: { data: [], headers: [] }
        })
    }
    setPrintEndHour(h) {
        let endParts = this.state.printInterval.end.split(':');
        let newEnd = [h].concat(endParts.slice(1));
        let end = newEnd.join(':');
        this.setState({
            printInterval: {
                date: this.state.printInterval.date,
                start: this.state.printInterval.start,
                end: end
            },
            printTable: { data: [], headers: [] }
        })
    }
    setPrintEndMinute(m) {
        let endParts = this.state.printInterval.end.split(':');
        let newEnd = [endParts[0]].concat([m]);
        let end = newEnd.join(':');
        this.setState({
            printInterval: {
                date: this.state.printInterval.date,
                start: this.state.printInterval.start,
                end: end
            },
            printTable: { data: [], headers: [] }
        })
    }
    fetchPrintRows() {
        let store = this;
        let token = this.sessionStore.state.token;
        let url = URLs.baseUrl + URLs.rows.list + '?' +
            URLs.rows.dayParam + '=' + this.state.printInterval.date + '&' +
            URLs.rows.startMinuteParam + '=' + this.state.printInterval.start + '&' +
            URLs.rows.endMinuteParam + '=' + this.state.printInterval.end;
        store.setState({ printTableLoading: true });
        fetch(url, { method: 'GET', headers: authHeaders(token) })
        .then((response) => statusRouter(response, store.sessionActions.signOut))
        .then(chooseTextOrJSON)
        .then(function(payload){
            let result = parseRows(payload, store.state.type);
            if (result.error !== null) {
                store.setState({ printTableLoading: false });
                return store.userActions.errorArrived(
                    result.error,
                    store.rowsActions.fetchAgainRequested,
                    false
                );
            }
            return store.setState({
                printTableLoading: false,
                printTable: {
                    data: result.rows.data,
                    headers: result.rows.headers
                }
            });
        });
    }

    fetchSecondaryRows(dayParam) {
        // console.log('fetchSecondaryRows', dayParam,
        //     this.userStore.state.newSecondaryRow.variableComboID,
        //     this.state.secondary.autoUpdate
        // );
        dayParam = dayParam || '';
        let varParam = (
            this.userStore.state.newSecondaryRow.variableComboID &&
            this.state.secondary.autoUpdate
        ) ? this.userStore.state.newSecondaryRow.variableComboID : '';
        // console.log('===fetchSecondaryRows===', dayParam, '-', varParam, JSON.stringify(this.userStore.state.newSecondaryRow));
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
        url += '&' + URLs.rows.secondTableVariableParam + '=' + varParam;
        // console.log('GET ', url);
        fetch(url, {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then((response) => statusRouter(response, store.sessionActions.signOut))
        .then(chooseTextOrJSON)
        .then(function(payload){
            // console.log('OK', URLs.rows.secondTable);
            // console.log('result', payload);
            // console.log('result', JSON.stringify(payload, 2, ' '));
            let result = parseSecondaryRows(payload);
            // console.log('parsed result', result);
            store.rowsActions.secondaryRowsFetchCompleted(result.rows);

            if (result.error !== null) {
                store.userActions.errorArrived(result.error);
                if (result.errorCode === 1002){
                    // invalid start time error, use startTime, endTime and day
                    // values from previous result
                    // see updateSecondTableFormDay() of the user.js store
                    console.log('errorCode 1002, dont stop autoupdate');
                }else{
                    store.stopSecondaryAutoUpdate();
                }
            } else {
                if (store.state.secondary.autoUpdate) {
                    store.startSecondaryAutoUpdate();
                }
            }


        })
        .catch(function(e){
            console.log('fetch error ' + URLs.rows.secondTable, e); // eslint-disable-line
        });
    }
    updateSecondTable(data){
        // console.log('updateSecondTable', data);
        let newValues = merge({}, this.state.secondary);
        //overwrite rows and headers
        if (data.headers.length > 0){
            newValues.headers = data.headers;
            newValues.data = data.data;
        }else{
            console.warn('BUG #99 - empty headers on secondary table result');
        }
        newValues.autoUpdate = data.autoUpdate;
        newValues.lastLoad = new Date().getTime();
        newValues.loading = false;
        // console.log('newValues', newValues);
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
        // console.log('---------');
        // console.log('modifySecondaryTable POST body', postBody, postHeaders);
        // console.log('---------');


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
            // console.log('OK (post)', URLs.rows.secondTableAutoupdateParam);
            // console.log('result (post)', URLs.rows.secondTableAutoupdateParam, payload);
            let result = secondTablePostResponseOK(payload);
            if (result.error !== null) {
                store.userActions.errorArrived(result.error);
            } else if (result.success){
                if (!store.state.secondary.autoUpdate){
                    store.fetchSecondaryRows();
                }else{
                    store.fetchSecondaryRows(
                        store.userStore.state.newSecondaryRow.day +
                        ' ' + store.userStore.state.newSecondaryRow.startTime
                    );
                }
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
        this.modifySecondaryTable(params);
    }
    removeSecondaryRow(key){
        let rowHeaders = this.state.secondary.headers[Math.floor(key/2)];
        let rowHeaderParts = rowHeaders[4].replace('- ', '').split(' ');
        let varComboItem = find(this.variablesStore.state.rawCombos,
                                                    'label', rowHeaders[0]);
        let params = {
            action: 'remove',
            day: rowHeaderParts[0],
            startTime: rowHeaderParts[1],
            endTime: rowHeaderParts[2],
            variableComboID: varComboItem.id,
            autoUpdate: false
        }
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
                    //and stop the auto fetching
                    this.stopSecondaryAutoUpdate();
                }
                this.setState({ secondary: secondary});
                break;
            case 'action':
                if (change.value === 'add'){
                    if (!secondary.autoUpdate){
                        this.addSecondaryRow();
                    } else {
                        //example: '2015-10-09 06:00'
                        this.fetchSecondaryRows(
                            this.userStore.state.newSecondaryRow.day +
                            ' ' + this.userStore.state.newSecondaryRow.startTime
                        );
                    }
                }else{
                    // console.log('=== REMOVE ROW ===', change.value);
                    this.removeSecondaryRow(change.value);
                }
                break;
            default:
                break;
        }
    }
    fetchRows(token, newType, endTime, resetRows) {
        let store = this;
        let type = store.state.type;
        if (typeof newType === 'string'){
            type = newType;
        }
        token = token || store.sessionStore.state.token;
        if (token === null){ return false; }
        // console.log('GET', type, URLs.rows[type], endTime);

        let lastEndTime = endTime || (resetRows ? '' : store.state.lastEndTime);
        endTime = endTime || '';

        // if (
        //     endTime === '' &&
        //     ! store.userStore.state.autoUpdate &&
        //     store.userStore.state.archivedReport &&
        //     store.userStore.state.archivedReport.end
        // ) {
        //     endTime = store.userStore.state.archivedReport.end.substring(0, 5);
        // }
        // let url = URLs.baseUrl + URLs.rows.rowsError;
        let url = URLs.baseUrl + URLs.rows[type] + '?' +
                        URLs.rows.endTimeParam + '=' + endTime + '&' +
                        URLs.rows.lastEndTimeParam + '=' + lastEndTime;
        // console.log('== fetch Rows url ==', url);
        if (URLs.rows[type] === undefined){ return false; }
        store.setState({
            loading: true,
            lastEndTime: lastEndTime
        });
        fetch(url, {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then((response) => statusRouter(response, store.sessionActions.signOut))
        .then(chooseTextOrJSON)
        .then(function(payload){
            // console.log('OK', URLs.rows[type], resetRows);
            // console.log('result', payload);
            let result = parseRows(payload, store.state.type);
            // console.log('parsed result', result);
            //edge case, column got removed from the backend between fetches
            let enabledColumns = store.columnsStore.state.enabled;
            if (
                Array.isArray(enabledColumns) &&
                Array.isArray(result.rows.data) &&
                enabledColumns.length > 1 &&
                result.rows.data.length > 1 &&
                result.rows.data[0].length !== enabledColumns.length
            ){
                // console.log('number of columns', result.rows.data[0].length, 'vs', enabledColumns.length);
                // console.log('--- COLUMN REMOVED FROM SERVER ---');
                let languageStore = store.flux.getStore('language');
                let columnsActions = store.flux.getActions('columns');
                columnsActions.outOfSync();
            }
            // console.log(result.rows.data.length +' rows');
            if (resetRows){
                store.resetRows();
            }
            store.rowsActions.rowsFetchCompleted(result);
            if (result.error !== null) {
                let isWarning = result.errorCode === 1001;
                let shouldAlert = result.errorCode !== 98;

                // console.log('errorCode', result.errorCode, isWarning);

                if (shouldAlert){
                    store.userActions.errorArrived(result.error,
                        store.rowsActions.fetchAgainRequested, isWarning);
                }

                //errors 101 and 98 returns the rows, so autoupdate don't need
                //to be interrupted.
                if (result.errorCode === 101){
                    //error 101 changes the startTime on the server
                    //but the app needs to change it on the UI
                    //p.user.archivedReport.start
                    store.rowsActions.returnChangedStartTime();
                }else if (result.errorCode === 98){
                    // error 98 should not warn the user nor interrupt autoUpdate
                    // just do nothing.
                    // na verdade mostrar a mensagem, no balaozinho debaixo, do carregando
                    console.log('error 98:', result.error);
                }else{
                    store.stopAutoUpdate();
                }
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
    resetSecondaryRows(){}
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
    startSecondaryAutoUpdate(){
        // console.log('startSecondaryAutoUpdate');
        let store = this;
        window.clearInterval(store.secondaryAutoUpdateInterval);
        store.secondaryAutoUpdateInterval = window.setInterval(function(){
            // console.log('secondary autoupdate fetch');
            store.fetchSecondaryRows(
                store.userStore.state.newSecondaryRow.day + ' ' +
                store.userStore.state.newSecondaryRow.startTime
            );
        }, AUTOUPDATE_INTERVAL);
    }
    stopSecondaryAutoUpdate(){
        // console.log('stopSecondaryAutoUpdate');
        window.clearInterval(this.secondaryAutoUpdateInterval);
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
            // console.log('day changed replace data');
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
            // console.log('Pagination occured right in between 00:00 and 23:59');
            lastHeaderLabel = lastHeaderLabel.replace('00:', '24:');
        }
        //if received first header (16:59) is close to last existing header (17:00)
        //this is a pagination, so append to the end of the list
        let timeDiff = this.TextToMinutes(lastHeaderLabel) -
                        this.TextToMinutes(firstNewHeaderLabel);
        appendToEnd = (timeDiff > 0);
        // console.log('APPEND TO END?', lastHeaderLabel, firstNewHeaderLabel, timeDiff, appendToEnd);

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
                }else{
                    console.warn('some rows has more columns than expected');
                }
            });
        }
        // console.log('getColumnsFromRows', columns);
        return columns;
    }
    updateMenuLabel(data) {
        // console.log('updateMenuLabel', data.errorCode, data.error);
        let nonBlockingErrorMessage = data.errorCode === 98 ? data.error : null;
        if (data.rows === undefined || data.rows.data === null ||
            data.rows.data.length === 0 ||
            (data.rows.data.length === 1 && data.rows.data[0].length === 1 && data.rows.data[0][0] === null)
        ){
            // console.log('no data');
            this.setState({
                lastLoad: new Date().getTime(),
                loading: false,
                nonBlockingErrorMessage: nonBlockingErrorMessage
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
            loading: false,
            nonBlockingErrorMessage: nonBlockingErrorMessage
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
    columnSelectionChange(obj){
        // console.log('columnSelectionChange', obj);
        if (!obj.checked){
            //column removed
            let columnIndex = obj.columnIndex;
            let newRows = this.state.data.map((row) =>{
                let newRow = row.slice();
                newRow.splice(columnIndex, 1);
                return newRow;
            });
            // console.log('--- --- columnSelectionChange', this.state.data[0], newRows[0]);
            this.setState({
                lastLoad: new Date().getTime(),
                data: newRows
            });
        }
    }
    columnMoved(indexes){
        if (indexes.oldIndex === indexes.newIndex){
            return null;
        }
        let newRows = this.state.data.map((row) =>{
            let newRow = row.slice();
            let item = row[indexes.oldIndex];
            newRow.splice(indexes.oldIndex, 1);
            newRow.splice(indexes.newIndex, 0, item);
            return newRow;
        });
        this.setState({
            lastLoad: new Date().getTime(),
            data: newRows
        });
    }
    printTable(){
        // console.log('printTable');
        let tableProperties = {
            flux: this.flux,
            // ggroups: this.flux.getStore('groups').state,
            vars: this.flux.getStore('vars').state,
            user: this.flux.getStore('user').state,
            language: this.flux.getStore('language').state,
            columns: this.flux.getStore('columns').state,
            rows: this.state,
            ui: this.flux.getStore('ui').state,
            iconWidth: 30
        };
        if (this.state.printTable.data.length) {
            tableProperties.rows.data = this.state.printTable.data;
            tableProperties.rows.headers = this.state.printTable.headers;
        }
        let tableHTML = renderToStaticMarkup(
            DOM.html(null,
                DOM.head(null,
                    DOM.link({
                        href: './lib/css/normalize.css',
                        rel: 'stylesheet'
                    }),
                    DOM.link({
                        href: './lib/css/typography.css',
                        rel: 'stylesheet'
                    }),
                    DOM.link({
                        href: './css/main.css',
                        rel: 'stylesheet'
                    })
                ),
                DOM.body({
                        style: {
                            overflow: 'auto',
                            marginBottom: 50
                        }
                    },
                    createElement(SimpleTable, tableProperties),
                    DOM.script({dangerouslySetInnerHTML: {__html: `
                        window.onload = function(){
                            window.print();
                        };
                        `}}
                    )
                )
            )
        );
        // console.log(tableHTML);
        let printWindow = window.open('', 'printWindow', 'scrollbars=yes');
        printWindow.document.write(tableHTML);
        printWindow.document.close();
    }
}

export default RowsStore;
