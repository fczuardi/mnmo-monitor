import {Store} from 'flummox';
import URLs from '../../config/endpoints.js';
import {
    authHeaders,
    statusRouter,
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
        const userStore = flux.getStore('user');
        const userActions = flux.getActions('user');
        const sessionActions = flux.getActions('session');
        const columnsActions = flux.getActions('columns');
        this.register(userActions.menuVisibilityToggle, this.changeMenuState);
        this.register(columnsActions.outOfSync, this.fetchColumns);
        this.register(columnsActions.updateColumnSelectedState, this.updateSelection);
        this.register(columnsActions.columnsFetched, this.columnsFetched);
        this.register(columnsActions.columnMoved, this.columnMoved);
        this.register(columnsActions.columnIconFailed, this.columnIconBroken);
        this.register(columnsActions.columnHeaderSelected, this.columnSelected);
        this.register(columnsActions.columnColorChanged, this.columnColorChanged);
        this.register(userActions.preferencesFetched, this.userPreferencesFetched);
        this.register(userActions.preferencesPublished, this.userChanged);
        this.state = {
            enabled: [
            ],
            disabled: [
            ],
            customColors: null, // ex: ['#b40931', '#cc5d09', '#cca109', ..., '#213ba8', '#941ec5', '#b8b8b8', '#5f5f5f']
            selected: null
        };
        this.sessionStore = sessionStore;
        this.sessionActions = sessionActions;
        this.columnsActions = columnsActions;
        this.userStore = userStore;
        this.userActions = userActions;
        this.flux = flux;
        this.shouldPostChange = false;
        //columns state changed
        this.addListener('change', function(){
            this.savePreferences();
        });
        this.previousSelectedGroup = userStore.state.groupID;
    }
    savePreferences() {
        //publich logged-user columns changes to the server
        if (this.shouldPostChange){
            this.publishChanges();
        }
    }

    userPreferencesFetched(pref) {
        this.fetchColumns(this.sessionStore.state.token);
    }

    userChanged(newState) {
        // console.log('userChanged');
        if (newState.groupID !== this.previousSelectedGroup){
            this.fetchColumns(this.sessionStore.state.token);
            this.previousSelectedGroup = newState.groupID;
        }
    }

    changeMenuState(){
        if (this.flux.getStore('ui').state.menuClosed){
            //refresh columns list every time the user opens the menu
            this.fetchColumns();
        }
    }

    updateCustomColors(enabled){
        let customColors = enabled.map(c => c.customColor);
        this.setState({ customColors: customColors });
    }

    fetchColumns(token) {
        // console.log('fetchColumns');
        let store = this;
        token = token || store.sessionStore.state.token;
        if (token === null){ return false; }
        // console.log('GET', URLs.columns.list);
        fetch(URLs.baseUrl + URLs.columns.list, {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then((response) => statusRouter(response, store.sessionActions.signOut))
        .then(chooseTextOrJSON)
        .then(function(payload){
            // console.log('result', URLs.columns.list, payload);
            // console.log('OK ' + URLs.columns.list);
            let columns = parseColumnsList(payload);
            // console.log('parsed result', columns);
            // if (columns.error !== null) {
            //     console.log('error arrived');
            //     store.userActions.errorArrived(columns.error);
            //     return null;
            // } else {
            // }
            store.updateCustomColors(columns.enabled);
            store.columnsActions.columnsFetched(columns);
        })
        .catch(function(e){
            console.log('fetch error ' + URLs.columns.list, e); // eslint-disable-line
        });
    }
    columnsFetched(columns) {
        this.shouldPostChange = false;
        this.setState(columns);
    }
    publishChanges() {
        let store = this,
            token = store.sessionStore.state.token,
            hasChanged = diffColumnsList(store.state),
            postBody = buildColumnsListPostBody(store.state);
        if (token === null){ return false; }
        if (hasChanged === false){ return false; }
        if (!postBody){ return false; }
        // console.log('POST ' + URLs.columns.list);
        fetch(URLs.baseUrl + URLs.columns.list, {
            method: 'POST',
            headers: authHeaders(token),
            body: postBody
        })
        .then((response) => statusRouter(response, store.sessionActions.signOut))
        .then(chooseTextOrJSON)
        .then(function(payload){
            let response = columnListPostResponseOK(payload);
            // console.log('result (post)', URLs.columns.list, response);
            let newState = response;
            // console.log('OK (post)', URLs.columns.list);
            store.updateCustomColors(newState.enabled);
            store.columnsActions.columnsPublished(newState);
        })
        .catch(function(e){
            console.log('POST error ' + URLs.columns.list, e); // eslint-disable-line
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
        this.shouldPostChange = true;
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

    columnMoved(indexes) {
        if (indexes.oldIndex === indexes.newIndex){
            return null;
        }
        let newEnabled = this.state.enabled.slice(),
            item = newEnabled[indexes.oldIndex];
        newEnabled.splice(indexes.oldIndex, 1);
        newEnabled.splice(indexes.newIndex, 0, item);
        this.shouldPostChange = true;
        this.setState({
            enabled: newEnabled
        });
    }

    columnIconBroken(columnID) {
        let enabledColumns =  this.state.enabled.map((column) => {
            if (column.id === columnID) {
                column.iconError = true;
            }
            return column;
        });
        let disabledColumns =  this.state.disabled.map((column) => {
            if (column.id === columnID) {
                column.iconError = true;
            }
            return column;
        });
        this.shouldPostChange = false;
        this.setState({
            enabled: enabledColumns,
            disabled: disabledColumns
        });
    }

    columnColorChanged(colorObj) {
        const index = colorObj.index;
        const newColor = colorObj.color;
        const newEnabled = this.state.enabled.map((column, i) => {
            if (i !== index) {
                return column;
            }
            column.customColor = newColor;
            return column;
        });
        this.updateCustomColors(newEnabled);
        this.shouldPostChange = true;
        this.setState({
            enabled: newEnabled
        });
    }
    
    columnSelected(index) {
        this.shouldPostChange = false;
        this.setState({
            selected: index
        });
    }
}

export default ColumnsStore;
