import {Store} from 'flummox';
import merge from 'lodash/object/merge';
import find from 'lodash/collection/find';
import keys from 'lodash/object/keys';
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
    buildUserPasswordPostBody,
    buildUserForgotPasswordPostBody,
    buildUserExpiredPasswordPostBody,
    userPreferencesPostResponseOK,
    passwordChangePostResponseOK,
    forgotPasswordPostResponseOK,
    authHeaders,
    statusRouter,
    chooseTextOrJSON,
    languageNames
} from '../../config/apiHelpers';
import queryString from 'query-string';

const qsParams = queryString.parse(window.location.search);
const qsParamsLower = {};
keys(qsParams).forEach( (key) => {
    qsParamsLower[key.toLowerCase()] = qsParams[key];
});
const qsLanguage = qsParams[URLs.user.languageParam];
const languageNameIndex = languageNames.indexOf(qsLanguage);
const defaultLanguageID = languageNameIndex !== -1 ? languageNameIndex : 1;

class UserStore extends Store {
    constructor(flux) {
        super();

        const userActions = flux.getActions('user');
        const countryActions = flux.getActions('country');
        const loginValidationActions = flux.getActions('loginValidation');
        const sessionActions = flux.getActions('session');
        const groupsActions = flux.getActions('groups');
        const rowsActions = flux.getActions('rows');
        this.sessionActions = sessionActions;
        this.flux = flux;
        this.register(rowsActions.returnChangedStartTime, this.updateStartTime);
        this.register(rowsActions.secondaryRowsFetchCompleted, this.updateSecondTableFormDay);
        this.register(rowsActions.rowsFetchCompleted, this.rowsFetchCompleted);
        this.register(userActions.usernameInput, this.changeUsernamePref);
        this.register(userActions.passwordInput, this.changePasswordPref);
        this.register(userActions.emailInput, this.changeEmailPref);
        this.register(userActions.rememberLoginUpdate, this.changeRememberPref);
        this.register(userActions.tosAgreementUpdate, this.changeTosPref);
        this.register(userActions.autoUpdateToggle, this.changeAutoUpdatePref);
        this.register(userActions.languageUpdate, this.changeLanguagePref);
        this.register(userActions.navigateToScreen, this.resetChangePasswordFields);
        this.register(userActions.currentPasswordInput, this.changeCurrentPasswordPref);
        this.register(userActions.newPasswordInput, this.changeNewPasswordPref);
        this.register(userActions.confirmNewPasswordInput, this.changeConfirmNewPasswordPref);
        this.register(userActions.changePasswordSubmitted, this.publishPasswordChange);
        this.register(userActions.changePasswordPublished, this.clearPasswordPref);
        this.register(userActions.forgotPasswordSubmitted, this.startForgotPassword);
        this.register(userActions.preferencesFetched, this.preferencesFetched);
        this.register(userActions.localPreferencesFetched, this.localPreferencesFetched);
        this.register(userActions.dateUpdated, this.changeDate);
        this.register(userActions.startHourUpdated, this.changeStartHour);
        this.register(userActions.startMinuteUpdated, this.changeStartMinute);
        this.register(userActions.endHourUpdated, this.changeEndHour);
        this.register(userActions.endMinuteUpdated, this.changeEndMinute);
        this.register(userActions.frequencyUpdated, this.changeFrequency);
        this.register(userActions.mergeFunctionUpdated, this.changeMergeFunction);
        this.register(userActions.secondTableFormChanged, this.secondTableFormUpdate);
        this.register(countryActions.select, this.changeCountryPref);
        this.register(loginValidationActions.captchaAnswered, this.changeCaptchaAnswer);
        this.register(sessionActions.signOut, this.resetCaptchaAnswer);
        this.register(sessionActions.refreshDataLoaded, this.overrideDefaults);
        this.register(sessionActions.tokenGranted, this.fetchPreferences);
        this.register(groupsActions.changeGroupSelection, this.changeGroupPref);
        this.register(groupsActions.changeSubGroupSelection, this.changeSubGroupPref);
        this.register(groupsActions.changeClassSelection, this.changeClassPref);
        this.userActions = userActions;
        this.state = {
            username: '',
            password: '',
            email: '',
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            customerName: '',
            countryID: null,
            rememberLogin: false,
            captchaAnswer: null,
            tosAgree: false,
            tosURL: '#',
            helpURL: '#',
            languageID: defaultLanguageID,
            autoUpdate: null,
            archivedReport: null, // ex: {date: "2015-12-05",end: "18:03:00",start: "05:40:00"}
            mergedRows: null,
            groupID: null,
            subgroupID: null,
            classID: null,
            classLabel: '',
            groupShortLabel: '',
            groupLabel: '',
            primaryVarLabel: '-',
            secondaryVarLabel: '-',
            variableComboID: null,
            compareVariables: true,
            newSecondaryRow: {
                primaryVarLabel: '-',
                secondaryVarLabel: '-',
                secondaryVarOptions: [{label: '-', value: '-'}],
                variableComboID: null,
                day: null,
                startTime: null,
                endTime: null
            }
        };
        //user preferences state changed
        this.addListener('change', function(){
            // console.log('user preferences state changed');
            this.savePreferences();
        });
        //TODO this can be better:
        //as it is currently, the stores below are required to be
        //created before this one in the flux.js file
        this.countryStore = flux.getStore('country');
        this.sessionStore = flux.getStore('session');
        this.groupsStore = flux.getStore('groups');
        this.varsStore = flux.getStore('vars');
        //some user settings updatas such as changing the languageID
        //doesnt return the other affected values in the POST return
        //so a new fetch is necessary after the change is published
        this.needsRefetch = false;
        //country store changed
        this.countryStore.addListener('change', this.countryOptionsLoaded.bind(this));
        //groups store changed
        this.groupsStore.addListener('change', this.groupsChanged.bind(this));
        //variables store changed
        this.varsStore.addListener('change', this.changeVarsPref.bind(this));
        //after all initial setup, load local preferences
        window.setTimeout(this.loadSavedPreferences.bind(this), 0);
    }

    overrideDefaults(refreshData){
        // console.log('overrideDefaults user', refreshData);
        if (!refreshData){
            return null
        }
        this.setState({
            newSecondaryRow: refreshData.user.newSecondaryRow === undefined ?
                                true : refreshData.user.newSecondaryRow
        });
    }


    // stateChange(){
    //     console.log('==--==CHANGE', this.state);
    // }

    rowsFetchCompleted(data){
        let values = merge({}, this.state.newSecondaryRow);
        // console.log('--..--..rowsFetchCompleted', values, '.', data);
        if (values.day === ''){
            // console.warn('EMPTY DAY');
            values.day = data.date;
            let calendarStore = this.flux.getStore('calendar');
            // console.log('__calendarStore.state', calendarStore.state)
            values.startTime = calendarStore.state.firstMinute;
            values.endTime = calendarStore.state.lastMinute;
            this.setState({
                newSecondaryRow: values
            });
        }
    }

    updateSecondTableFormDay(data){
        // console.log('--..--..updateSecondTableFormDay', data,
        //                 JSON.stringify(this.state.newSecondaryRow));
        let values = merge({}, this.state.newSecondaryRow);
        if (data && data.day && data.startTime && data.endTime){
            values.day = data.day;
            values.startTime = data.startTime;
            values.endTime = data.endTime;
        }else{
            // console.log('data.day is null?', data);
            let calendarStore = this.flux.getStore('calendar');
            // console.log('calendarStore.state', calendarStore.state)
            let rowsStore = this.flux.getStore('rows');
            // console.log('__rowsStore.state', rowsStore.state)
            values.day = rowsStore.state.date;
            values.startTime = calendarStore.state.firstMinute;
            values.endTime = calendarStore.state.lastMinute;
        }
        values.primaryVarLabel = this.state.newSecondaryRow.primaryVarLabel;
        values.secondaryVarLabel = this.state.newSecondaryRow.secondaryVarLabel;
        values.secondaryVarOptions = this.state.newSecondaryRow.secondaryVarOptions;
        // console.log('setState updateSecondTableFormDay', this.state, '---', values);
        this.setState({
            newSecondaryRow: values
        });
    }
    loadSavedPreferences() {
        let savedPreferences = getLocalItem('userPreference') || {};
        //override language if it's present on the query string
        if (qsLanguage && qsLanguage.length > 1){
            savedPreferences.languageID = defaultLanguageID;
        }
        let preferences = merge({}, this.state, savedPreferences);
        if (preferences === null) { return false; }
        this.userActions.localPreferencesFetched(preferences);
    }
    savePreferences() {
        // console.log('savePreferences');
        let localUserPreference = merge({}, this.state);
        let doNotStore = [
            'captchaAnswer',
            'currentPassword',
            'newPassword',
            'confirmNewPassword',
            'newSecondaryRow'
        ];
        doNotStore.forEach( (prefName) => {
            delete localUserPreference[prefName];
        });
        if (this.state.rememberLogin === true) {
            setLocalItem('userPreference', localUserPreference);
        }
        //post logged-user preference changes to the server
        this.updatePreferences();
    }
    fetchPreferences(token) {
        let store = this;
        // console.log('fetchPreferences', token, store.sessionStore.state.token);
        token = token || store.sessionStore.state.token;
        if (token === null){ return false; }
        console.log('GET', URLs.user.preferences);
        fetch(URLs.baseUrl + URLs.user.preferences, {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then((response) => statusRouter(response, store.sessionActions.signOut, store.sessionActions.signOut))
        .then(chooseTextOrJSON)
        .then(function(payload){
            console.log('OK', URLs.user.preferences);
            console.log('result', payload);
            let result = parseUserPreferences(payload);
            console.log('parsed result', result);
            let userPreferences = merge({}, result.prefs);
            if (result.error !== null) {
                if (result.errorCode === 500){
                    // console.log('Error 500, must open rows panel');
                    store.userActions.openPanel('rows');
                }
                store.userActions.errorArrived(result.error);
                return null;
            } else {
                if (store.needsRefetch){
                    store.needsRefetch = false;
                    // console.log('setState tosURL');
                    store.setState({
                        tosURL: userPreferences.tosURL,
                        helpURL: userPreferences.helpURL
                    });
                } else {
                    store.userActions.preferencesFetched(userPreferences);
                    if (result.warning) {
                        store.userActions.navigateToScreen('password');
                        store.userActions.errorArrived(result.warning, null, true);
                    }
                }
            }
        })
        .catch(function(e){
            console.log('fetch error', e); // eslint-disable-line
        });
    }
    localPreferencesFetched(preferences){
        // console.log('localPreferencesFetched');
        this.preferencesFetched(preferences);
    }
    preferencesFetched(preferences) {
        console.log('set user state: preferencesFetched', preferences.classLabel);
        this.setState(preferences);
    }
    publishPasswordChange(){
        // console.log('publishPasswordChange');
        let store = this;
        let token = store.sessionStore.state.token;
        let passwordToken = qsParams.token || null;
        if (token === null && passwordToken === null){
            // return false;
        }
        let hasForgotPasswordToken = (passwordToken !== null);
        let hasExpiredPassword = !hasForgotPasswordToken && token === null;
        let url = hasForgotPasswordToken ?
                    URLs.baseUrl + URLs.user.forgotPassword :
                    hasExpiredPassword ? URLs.baseUrl + URLs.user.expiredPassword :
                    URLs.baseUrl + URLs.user.password;
        let postBodyWithPasswordToken = {};
        postBodyWithPasswordToken[URLs.user.passwordTokenParam] = passwordToken;
        postBodyWithPasswordToken[URLs.user.countryParam] = qsParamsLower[URLs.user.countryParam.toLowerCase()];
        postBodyWithPasswordToken[URLs.user.languageParam] = qsParams[URLs.user.languageParam];

        let postBody = hasForgotPasswordToken ?
                        buildUserForgotPasswordPostBody(merge(store.state, postBodyWithPasswordToken)) :
                        hasExpiredPassword ?
                        buildUserExpiredPasswordPostBody(store.state) :
                        buildUserPasswordPostBody(store.state);
        let postHeaders = hasForgotPasswordToken || hasExpiredPassword ?
                            {'Content-Type': 'application/x-www-form-urlencoded'} :
                            authHeaders(token);

        console.log('POST', url);
        console.log('postBody', postBody);
        console.log('postHeaders', postHeaders);
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
            console.log('OK (post)', URLs.user.password, payload);
            let result = passwordChangePostResponseOK(payload);
            if (result.error !== null) {
                store.userActions.errorArrived(result.error);
            } else if (result.success){
                //reset browser's location.search
                //to clear any forgot password parameters if they are present
                if (window.location.search.length > 0) {
                    window.location.search = '';
                }else{
                    store.userActions.changePasswordPublished(store.state.newPassword);
                }
            }
        })
        .catch(function(e){
            console.log('password change failed ' + URLs.user.password, e); // eslint-disable-line
        });
    }
    startForgotPassword(){
        console.log('start forgot password flow');
        let store = this;
        console.log('GET', URLs.user.forgotPassword);
        // console.log('query params',
        //     URLs.user.countryParam, store.state.countryID,
        //     URLs.user.emailParam, store.state.email
        // );

        let postBody = {};
        postBody[URLs.user.countryParam] = store.state.countryID;
        postBody[URLs.user.emailParam] = store.state.email;
        postBody[URLs.user.language] = languageNames[store.state.languageID || 0];

        let url = URLs.baseUrl + URLs.user.forgotPassword;
        url += '?' + queryString.stringify(postBody);
        fetch(url, {method: 'GET'})
        .then((response) => statusRouter(response, store.sessionActions.signOut))
        .then(chooseTextOrJSON)
        .then(function(payload){
            console.log('OK (get)', URLs.user.forgotPassword, payload);
            let result = forgotPasswordPostResponseOK(payload);
            if (result.error !== null) {
                store.userActions.errorArrived(result.error);
            } else if (result.success){
                store.userActions.forgotPasswordAccepted();
            }
        })
        .catch(function(e){
            console.log('forgot password start failed' + URLs.user.forgotPassword, e); // eslint-disable-line
        });
    }
    updatePreferences() {
        let store = this;
        // console.log('updatePreferences.');
        let token = store.sessionStore.state.token;
        if (token === null){ return false; }
        // console.log('updatePreferences..', token);
        // console.log('updatePreferences..', store.state);
        let hasChanged = diffUserPreferences(store.state);
        if (hasChanged === false){ return false; }
        // console.log('updatePreferences...');
        let debugParams = queryString.parse(location.search);
        let state = merge({}, store.state);
        if (debugParams.debug === 'user'){
            console.log('DEBUG: ', debugParams);
            //example http://localhost:8001/?debug=user&archivedReport={%22date%22:%222016-01-26%22,%22end%22:%2220:00:00%22,%22start%22:%2208:00:00%22}
            let archivedReport = JSON.parse(debugParams.archivedReport);
            if (archivedReport.date && archivedReport.end && archivedReport.start){
                state.archivedReport = archivedReport;
            }
        }
        let postBody = buildUserPreferencesPostBody(state);
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
            console.log('result (post)', URLs.user.preferences, payload);
            let result = userPreferencesPostResponseOK(payload),
                newState = result.data;
            console.log('parsed result', result);
            console.log('parsed newState', newState);
            console.log('store.state.languageID',store.state.languageID, newState.languageID);
            if (store.needsRefetch){
                console.log('Language changed, fetch user preferences again');
                store.fetchPreferences();
            }
            // userPreferencesPostResponseOK(payload);
            store.userActions.preferencesPublished(newState);
            if (result.error !== null) {
                let openedPanel = store.flux.getStore('ui').state.panel;
                console.log('---ERROR---', openedPanel , result.errorCode, (result.errorCode >= 10051 && result.errorCode <= 10054));
                if (result.errorCode >= 10051 && result.errorCode <= 10054 && openedPanel !== 'rows'){
                    let calendarStore = store.flux.getStore('calendar');
                    let startTime = calendarStore.state.firstMinute;
                    console.log('Invalid time interval errors, must do something', result.data.archivedReport.start);
                    console.log(result.error);
                    if (result.errorCode !== 10052){
                        //change user start time to the first minute of the day
                        //automatically for the user and don't display any errors
                        store.updateStartTime();
                    }else{
                        //start is already the first minute, so the end time
                        //is the problem and the user must fix it manually
                        store.userActions.errorArrived(result.error);
                        store.userActions.openPanel('rows', true);
                    }
                }else{
                    store.userActions.errorArrived(result.error);
                }

                //userPreferencesPostResponseOK returns the last known-to-work
                //user preferences on error, so we rollback to that
                //BUT only if autoupdate was already off otherwise this
                //could create a situation where the user turned autoupdate on
                //with an invalid time range and can't fix it through the interface
                //because that panel is only available when autoUpdate is off
                //see bug #87
                if (newState.autoUpdate === false){
                    // console.log('set user state: updatePreferences error', newState.archivedReport.start, newState.archivedReport.end);
                    store.setState(newState);
                }
            }
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
        // console.log('set user state: changeUsernamePref');
        this.setState({
            username: username
        });
    }
    changePasswordPref(password) {
        // console.log('set user state: changePasswordPref');
        this.setState({
            password: password
        });
    }
    clearPasswordPref(password) {
        // console.log('clear user state: clearPasswordPref');
        this.setState({
            password: '',
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        });
    }
    changeEmailPref(email) {
        // console.log('email changed');
        this.setState({
            email: email
        });
    }
    changeCountryPref(countryID) {
        let tosURL,
            helpURL;
        this.countryStore.state.options.forEach(function(item){
            if (item.id === countryID){
                tosURL = item.tosURL;
                helpURL = item.helpURL;
            }
        });
        // console.log('set user state: changeCountryPref', tosURL, countryID, this.countryStore.state);
        this.setState({
            countryID: countryID,
            tosURL: tosURL || this.state.tosURL,
            helpURL: helpURL || this.state.helpURL
        });
    }
    changeCaptchaAnswer(answer) {
        // console.log('set user state: changeCaptchaAnswer');
        this.setState({
            captchaAnswer: answer
        });
    }
    resetCaptchaAnswer() {
        // console.log('set user state: resetCaptchaAnswer');
        this.setState({
            captchaAnswer: null
        });
    }
    clearPreferences() {
        removeLocalItem('userPreference');
    }
    changeRememberPref(shouldRemember) {
        // console.log('set user state: changeRememberPref');
        this.setState({
            rememberLogin: shouldRemember
        });
        if (shouldRemember === false){
            this.clearPreferences();
        }
    }
    changeTosPref(haveAgreed) {
        // console.log('set user state: changeTosPref');
        this.setState({
            tosAgree: haveAgreed
        });
    }
    changeAutoUpdatePref(autoUpdateState) {
        // console.log('set user state: changeAutoUpdatePref');
        this.setState({
            autoUpdate: autoUpdateState
        });
    }
    changeLanguagePref(languageID) {
        console.log('set user state: changeLanguagePref');
        this.needsRefetch = true;
        this.setState({
            languageID: languageID
        });
    }
    getGroupFromStore(groupID) {
        let groupsState = this.flux.getStore('groups').state;
        let allGroups = groupsState.type1.concat(groupsState.type2);
        let selectedGroup = find(allGroups, 'id', groupID);
        // console.log('getGroupFromStore', selectedGroup);
        return selectedGroup;
    }
    changeGroupPref(groupID){
        if (groupID === null) { return false }
        let intGroupID = parseInt(groupID);
        if (intGroupID === this.state.groupID){ return false; }
        let selectedGroup = this.getGroupFromStore(intGroupID);
        let classID = selectedGroup.classes.length === 1 ?
                        selectedGroup.classes[0].id : this.state.classID;
        // console.log('set user state: changeGroupPref', selectedGroup);
        this.setState({
            groupID: intGroupID,
            subgroupID: null,
            groupShortLabel: selectedGroup.shortLabel,
            groupLabel: selectedGroup.label,
            classID: classID
        });
    }
    changeSubGroupPref(subGroupID) {
        // console.log('set user state: changeSubGroupPref');
        this.setState({
            subgroupID: subGroupID
        });
    }
    changeClassPref(classID) {
        // console.log('set user state: changeClassPref');
        this.setState({
            classID: classID
        });
    }
    changeVarsPref(){
        let newVars = this.varsStore.state.combo;
        // console.log('set user state: changeVarsPref');
        this.setState({
            primaryVarLabel: newVars.first,
            secondaryVarLabel: newVars.second,
            variableComboID: newVars.comboID,
        });
    }
    updateStartTimeIfList(archivedReport){
        let result = merge({}, archivedReport);
        let rowsType = this.flux.getStore('rows').state.type;
        // console.log('=== updateStartTimeIfList ===', rowsType);
        if (rowsType === 'list'){
            //always set startTime to first minute when posting user endTime
            //changes with the table type set to list
            console.log('user is changing end time on a minutes table, reset start time');
            result = this.overrideStartTime(result)
        }
        return result;
    }
    changeTime(hourOrMinute, value, startOrEnd) {
        let archivedReport = merge({}, this.state.archivedReport);
        let newValue = archivedReport[startOrEnd].split(':');
        value = (value < 10) ? ('0' + value) : value;
        newValue[(hourOrMinute === 'hour') ? 0 : 1] = value;
        archivedReport[startOrEnd] = newValue.join(':');
        // console.log('set user state: changeTime');
        archivedReport = this.updateStartTimeIfList(archivedReport);
        this.setState({
            archivedReport: archivedReport
        });
    }
    overrideStartTime(archivedReport){
        let calendarStore = this.flux.getStore('calendar');
        let startTime = calendarStore.state.firstMinute;
        let result = merge({}, archivedReport);
        result.start = startTime;
        return result;
    }
    updateStartTime() {
        // console.log('updateStartTime');
        let archivedReport = this.overrideStartTime(this.state.archivedReport);
        // console.log('updateStartTime', archivedReport);
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
        // console.log('set user state: changeFrequency');
        this.setState({
            mergedRows: mergedRows
        });
    }
    changeMergeFunction(functionID) {
        let mergedRows = merge({}, this.state.mergedRows);
        mergedRows.mergeFunctionID = functionID;
        // console.log('set user state: changeMergeFunction');
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
        // console.log('set user state: changeDate');
        this.setState({
            archivedReport: archivedReport
        });
    }
    resetChangePasswordFields() {
        // console.log('resetChangePasswordFields');
        this.setState({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        });
    }
    changeCurrentPasswordPref(password) {
        // console.log('set user state: currentPassword');
        this.setState({
            currentPassword: password
        });
    }
    changeNewPasswordPref(password) {
        // console.log('set user state: newPassword');
        this.setState({
            newPassword: password
        });
    }
    changeConfirmNewPasswordPref(password) {
        // console.log('set user state: confirmNewPassword');
        this.setState({
            confirmNewPassword: password
        });
    }
    getVariableComboIDFromLabels(s1, s2){
        let item = find(this.varsStore.state.rawCombos, 'label', s1 + '-' + s2) ||
                    find(this.varsStore.state.rawCombos, 'label', s1);
        let result = item.id;
        // console.log('getVariableComboIDFromLabels', result);
        return result;
    }
    secondTableFormUpdate(change) {
        console.log('secondTableFormUpdate', change);
        let newState = merge({},this.state.newSecondaryRow);
        switch (change.field){
            case 'autoUpdate':
                newState.autoUpdate = !newState.autoUpdate;
                break;
            case 'action':
                break;
            case 'variableComboID':
                // console.log('secondary table variableComboID changed', change);
                let extractedLabels = this.varsStore.state.rawCombos[change.value].label.split('-');
                let primaryVarLabel = extractedLabels[0];
                let secondaryVarLabel = extractedLabels[1] ? extractedLabels[1] : '-';
                let secondaryVarOptions = this.varsStore.state.combos[primaryVarLabel];
                newState[change.field] = change.value;
                newState.primaryVarLabel = primaryVarLabel;
                newState.secondaryVarLabel = secondaryVarLabel;
                newState.secondaryVarOptions = secondaryVarOptions;
                break;
            case 'primaryVarLabel':
                // console.log('primaryVarLabel changed to', change.value, this.varsStore.state.combos)
                newState[change.field] = change.value;
                newState.secondaryVarOptions =
                    this.varsStore.state.combos[change.value].map( (item) => {
                        return {
                            label: item.label,
                            value: item.label
                        }
                    });
                // console.log('--> secondaryVarOptions', newState.secondaryVarOptions);
                newState.variableComboID = this.getVariableComboIDFromLabels(
                    newState.primaryVarLabel, newState.secondaryVarLabel);
                break;
            case 'secondaryVarLabel':
                console.log('secondaryVarLabel changed to', change.value)
                newState[change.field] = change.value;
                newState.variableComboID = this.getVariableComboIDFromLabels(
                    newState.primaryVarLabel, newState.secondaryVarLabel);
                break;
            default:
                newState[change.field] = change.value;
                break;
        }
        // console.log('setState secondTableFormUpdate',newState);
        this.setState({
            newSecondaryRow: newState
        })

    }
}

export default UserStore;
