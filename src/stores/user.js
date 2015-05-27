import {Store} from 'flummox';
import merge from 'lodash/object/merge';
import find from 'lodash/collection/find';
import {
    getObject as getLocalItem,
    setObject as setLocalItem,
    removeObject as removeLocalItem
} from '../lib/local';
import URLs from '../../config/endpoints.js';
import {
    parseUserPreferences,
    diffUserPreferences,
    buildUserPreferencesPostBody,
    userPreferencesPostResponseOK,
    authHeaders,
    statusRouter,
    chooseTextOrJSON
} from '../../config/apiHelpers';

class UserStore extends Store {
    constructor(flux) {
        super();
        const userActions = flux.getActions('user');
        const countryActions = flux.getActions('country');
        const loginValidationActions = flux.getActions('loginValidation');
        const sessionActions = flux.getActions('session');
        const groupsActions = flux.getActions('groups');
        this.sessionActions = sessionActions;
        this.flux = flux;
        this.register(userActions.usernameInput, this.changeUsernamePref);
        this.register(userActions.passwordInput, this.changePasswordPref);
        this.register(userActions.rememberLoginUpdate, this.changeRememberPref);
        this.register(userActions.tosAgreementUpdate, this.changeTosPref);
        this.register(userActions.autoUpdateToggle, this.changeAutoUpdatePref);
        this.register(userActions.languageUpdate, this.changeLanguagePref);
        this.register(userActions.preferencesFetched, this.preferencesFetched);
        this.register(userActions.dateUpdated, this.changeDate);
        this.register(userActions.startHourUpdated, this.changeStartHour);
        this.register(userActions.startMinuteUpdated, this.changeStartMinute);
        this.register(userActions.endHourUpdated, this.changeEndHour);
        this.register(userActions.endMinuteUpdated, this.changeEndMinute);
        this.register(userActions.frequencyUpdated, this.changeFrequency);
        this.register(userActions.mergeFunctionUpdated, this.changeMergeFunction);
        this.register(countryActions.select, this.changeCountryPref);
        this.register(loginValidationActions.captchaAnswered, this.changeCaptchaAnswer);
        this.register(sessionActions.signOut, this.resetCaptchaAnswer);
        this.register(sessionActions.tokenGranted, this.fetchPreferences);
        this.register(groupsActions.changeGroupSelection, this.changeGroupPref);
        this.register(groupsActions.changeSubGroupSelection, this.changeSubGroupPref);
        this.register(groupsActions.changeClassSelection, this.changeClassPref);
        this.userActions = userActions;
        this.state = {
            username: '',
            password: '',
            countryID: null,
            rememberLogin: false,
            captchaAnswer: null,
            tosAgree: false,
            tosURL: '#',
            languageID: null,
            autoUpdate: null,
            archivedReport: null,
            mergedRows: null,
            groupID: null,
            subgroupID: null,
            classID: null,
            groupShortLabel: '',
            primaryVarLabel: '-',
            secondaryVarLabel: '-',
            variableComboID: null,
            compareVariables: true
        };
        this.loadSavedPreferences();
        //user preferences state changed
        this.addListener('change', function(){
            this.savePreferences();
        });
        //TODO this can be better:
        //as it is currently, the stores below are required to be
        //created before this one in the flux.js file
        this.countryStore = flux.getStore('country');
        this.sessionStore = flux.getStore('session');
        this.groupsStore = flux.getStore('groups');
        this.varsStore = flux.getStore('vars');
        //country store changed
        this.countryStore.addListener('change', this.countryOptionsLoaded.bind(this));
        //groups store changed
        this.groupsStore.addListener('change', this.groupsChanged.bind(this));
        //variables store changed
        this.varsStore.addListener('change', this.changeVarsPref.bind(this));
        this.fetchPreferences();
    }
    loadSavedPreferences() {
        let preferences = getLocalItem('userPreference');
        if (preferences === null) { return false; }
        this.setState(preferences);
        this.userActions.languageUpdate(preferences.languageID);
    }
    savePreferences() {
        let localUserPreference = merge({}, this.state);
        delete localUserPreference.captchaAnswer;
        if (this.state.rememberLogin === true) {
            setLocalItem('userPreference', localUserPreference);
        }
        //post logged-user preference changes to the server
        this.updatePreferences();
    }
    fetchPreferences(token) {
        let store = this;
        token = token || store.sessionStore.state.token;
        if (token === null){ return false; }
        console.log('GET', URLs.user.preferences);
        fetch(URLs.baseUrl + URLs.user.preferences, {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then((response) => statusRouter(response, store.sessionActions.signOut))
        .then(chooseTextOrJSON)
        .then(function(payload){
            console.log('OK', URLs.user.preferences);
            // console.log('result', payload);
            let userPreferences = merge({}, parseUserPreferences(payload));
            // console.log('userPreferences', userPreferences);
            store.userActions.preferencesFetched(userPreferences);
        })
        .catch(function(e){
            console.log('fetch error', e); // eslint-disable-line
        });
    }
    preferencesFetched(preferences) {
        this.setState(preferences);
    }
    updatePreferences() {
        let store = this;
        // console.log('updatePreferences.');
        let token = store.sessionStore.state.token;
        if (token === null){ return false; }
        // console.log('updatePreferences..');
        let hasChanged = diffUserPreferences(store.state);
        if (hasChanged === false){ return false; }
        // console.log('updatePreferences...');
        let postBody = buildUserPreferencesPostBody(store.state);
        if (!postBody){ return false; }
        console.log('POST', URLs.user.preferences);
        // console.log('postBody', postBody);
        fetch(URLs.baseUrl + URLs.user.preferences, {
            method: 'POST',
            headers: authHeaders(token),
            body: postBody
        })
        .then((response) => statusRouter(
            response, 
            store.sessionActions.signOut
        ))
        .then(chooseTextOrJSON)
        .then(function(payload){
            console.log('OK (post)', URLs.user.preferences);
            // console.log('result (post)', URLs.user.preferences, payload);
            let newState = userPreferencesPostResponseOK(payload);
            // console.log('newState', newState);
            // console.log('post success', payload, newState);
            // userPreferencesPostResponseOK(payload);
            store.userActions.preferencesPublished(newState);
        })
        .catch(function(e){
            console.log('parsing failed ' + URLs.user.preferences, e); // eslint-disable-line
            store.userActions.preferencesPublished();
        });
    }
    countryOptionsLoaded() {
        if (this.state.countryID === null){
            this.flux.getActions('country').select(
                                        this.countryStore.state.options[0].id);
        }
    }
    groupsChanged() {
        this.changeGroupPref(this.state.groupID, true);
    }
    changeUsernamePref(username) {
        this.setState({
            username: username
        });
    }
    changePasswordPref(password) {
        this.setState({
            password: password
        });
    }
    changeCountryPref(countryID) {
        let tosURL;
        this.countryStore.state.options.forEach(function(item){
            if (item.id === countryID){
                tosURL = item.tosURL;
            }
        });
        this.setState({
            countryID: countryID,
            tosURL: tosURL
        });
    }
    changeCaptchaAnswer(answer) {
        this.setState({
            captchaAnswer: answer
        });
    }
    resetCaptchaAnswer() {
        this.setState({
            captchaAnswer: null
        });
    }
    clearPreferences() {
        removeLocalItem('userPreference');
    }
    changeRememberPref(shouldRemember) {
        this.setState({
            rememberLogin: shouldRemember
        });
        if (shouldRemember === false){
            this.clearPreferences();
        }
    }
    changeTosPref(haveAgreed) {
        this.setState({
            tosAgree: haveAgreed
        });
    }
    changeAutoUpdatePref(autoUpdateState) {
        this.setState({
            autoUpdate: autoUpdateState
        });
    }
    changeLanguagePref(languageID) {
        this.setState({
            languageID: languageID
        });
    }
    getGroupFromStore(groupID) {
        let groupsState = this.flux.getStore('groups').state;
        let allGroups = groupsState.type1.concat(groupsState.type2);
        let selectedGroup = find(allGroups, 'id', groupID);
        return selectedGroup;
    }
    changeGroupPref(groupID){
        if (groupID === null) { return false }
        let intGroupID = parseInt(groupID);
        if (intGroupID === this.state.groupID){ return false; }
        let selectedGroup = this.getGroupFromStore(intGroupID);
        let classID = selectedGroup.classes.length === 1 ? 
                        selectedGroup.classes[0].id : this.state.classID;
        this.setState({
            groupID: intGroupID,
            subgroupID: null,
            groupShortLabel: selectedGroup.shortLabel,
            classID: classID
        });
    }
    changeSubGroupPref(subGroupID) {
        this.setState({
            subgroupID: subGroupID
        });
    }
    changeClassPref(classID) {
        this.setState({
            classID: classID
        });
    }
    changeVarsPref(){
        let newVars = this.varsStore.state.combo;
        this.setState({
            primaryVarLabel: newVars.first,
            secondaryVarLabel: newVars.second,
            variableComboID: newVars.comboID,
        });
    }
    changeTime(hourOrMinute, value, startOrEnd) {
        let archivedReport = merge({}, this.state.archivedReport);
        let newValue = archivedReport[startOrEnd].split(':');
        value = (value < 10) ? ('0' + value) : value;
        newValue[(hourOrMinute === 'hour') ? 0 : 1] = value;
        archivedReport[startOrEnd] = newValue.join(':');
        this.setState({
            archivedReport: archivedReport
        });
    }
    changeStartHour(h) {
        this.changeTime('hour', h, 'start');
    }
    changeStartMinute(m) {
        this.changeTime('minute', m, 'start');
    }
    changeEndHour(h) {
        this.changeTime('hour', h, 'end');
    }
    changeEndMinute(m) {
        this.changeTime('minute', m, 'end');
    }
    changeFrequency(frequencyID) {
        let mergedRows = merge({}, this.state.mergedRows);
        mergedRows.frequencyID = frequencyID;
        this.setState({
            mergedRows: mergedRows
        });
    }
    changeMergeFunction(functionID) {
        let mergedRows = merge({}, this.state.mergedRows);
        mergedRows.mergeFunctionID = functionID;
        this.setState({
            mergedRows: mergedRows
        });
    }
    changeDate(day) {
        //day is expected to be a string like 2015-04-25
        if (day.length !== 10) {
            return false;
        }
        let archivedReport = merge({}, this.state.archivedReport);
        archivedReport.date = day;
        this.setState({
            archivedReport: archivedReport
        });
    }
}

export default UserStore;
