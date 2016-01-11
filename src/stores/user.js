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
    buildUserPasswordPostBody,
    buildUserForgotPasswordPostBody,
    buildUserExpiredPasswordPostBody,
    userPreferencesPostResponseOK,
    passwordChangePostResponseOK,
    forgotPasswordPostResponseOK,
    authHeaders,
    statusRouter,
    chooseTextOrJSON
} from '../../config/apiHelpers';
import queryString from 'query-string';


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
        this.register(rowsActions.secondaryRowsFetchCompleted, this.updateSecondTableFormDay);
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
    // stateChange(){
    //     console.log('==--==CHANGE', this.state);
    // }
    updateSecondTableFormDay(data){
        // console.log('--..--..updateSecondTableFormDay', data,
        //                 JSON.stringify(this.state.newSecondaryRow));
        let values = merge({}, this.state.newSecondaryRow);
        values.day = data.day;
        values.startTime = data.startTime;
        values.endTime = data.endTime;
        values.primaryVarLabel = this.state.newSecondaryRow.primaryVarLabel;
        values.secondaryVarLabel = this.state.newSecondaryRow.secondaryVarLabel;
        values.secondaryVarOptions = this.state.newSecondaryRow.secondaryVarOptions;
        // console.log('setState updateSecondTableFormDay', this.state, '---', values);
        this.setState({
            newSecondaryRow: values
        });
    }
    loadSavedPreferences() {
        let preferences = merge({}, this.state, getLocalItem('userPreference'));
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
            console.log('result', payload);
            let result = parseUserPreferences(payload);
            console.log('parsed result', result);
            let userPreferences = merge({}, result.prefs);
            if (result.error !== null) {
                store.userActions.errorArrived(result.error);
                return null;
            } else {
                if (store.needsRefetch){
                    store.needsRefetch = false;
                    store.setState({
                        tosURL: userPreferences.tosURL
                    });
                } else {
                    store.userActions.preferencesFetched(userPreferences);
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
        // console.log('set user state: preferencesFetched');
        this.setState(preferences);
    }
    publishPasswordChange(){
        // console.log('publishPasswordChange');
        let store = this;
        let token = store.sessionStore.state.token;
        let passwordToken = queryString.parse(window.location.search).token || null;
        if (token === null && passwordToken === null){
            // return false;
        }
        let hasForgotPasswordToken = (passwordToken !== null);
        let hasExpiredPassword = !hasForgotPasswordToken && token === null;
        let url = hasForgotPasswordToken ?
                    URLs.baseUrl + URLs.user.forgotPassword :
                    hasExpiredPassword ? URLs.baseUrl + URLs.user.expiredPassword :
                    URLs.baseUrl + URLs.user.password;
        let postBody = hasForgotPasswordToken ?
                        buildUserForgotPasswordPostBody(merge(store.state, {
                            passwordToken:passwordToken,
                            countryID: queryString.parse(window.location.search.toUpperCase())[URLs.user.countryParam.toUpperCase()]
                        })) : hasExpiredPassword ?
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
                    store.userActions.navigateToScreen(null);
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
        let url = URLs.baseUrl + URLs.user.forgotPassword + '?' +
                URLs.user.countryParam + '=' + store.state.countryID + '&' +
                URLs.user.emailParam + '=' + store.state.email;
        fetch(url, {method: 'GET'})
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
            console.log('result (post)', URLs.user.preferences, payload);
            let result = userPreferencesPostResponseOK(payload),
                newState = result.data;
            // console.log('newState', newState);
            console.log('parsed newState', newState);
            console.log('store.state.languageID',store.state.languageID, newState.languageID);
            if (store.needsRefetch){
                console.log('Language changed, fetch user preferences again');
                store.fetchPreferences();
            }
            // userPreferencesPostResponseOK(payload);
            store.userActions.preferencesPublished(newState);
            if (result.error !== null) {
                store.userActions.errorArrived(result.error);
                //userPreferencesPostResponseOK returns the last known-to-work
                //user preferences on error, so we rollback to that
                // console.log('set user state: updatePreferences error', newState.archivedReport.start, newState.archivedReport.end);
                store.setState(newState);
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
        let tosURL;
        this.countryStore.state.options.forEach(function(item){
            if (item.id === countryID){
                tosURL = item.tosURL;
            }
        });
        // console.log('set user state: changeCountryPref', tosURL, countryID, this.countryStore.state);
        this.setState({
            countryID: countryID,
            tosURL: tosURL || this.state.tosURL
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
        return selectedGroup;
    }
    changeGroupPref(groupID){
        if (groupID === null) { return false }
        let intGroupID = parseInt(groupID);
        if (intGroupID === this.state.groupID){ return false; }
        let selectedGroup = this.getGroupFromStore(intGroupID);
        let classID = selectedGroup.classes.length === 1 ?
                        selectedGroup.classes[0].id : this.state.classID;
        // console.log('set user state: changeGroupPref');
        this.setState({
            groupID: intGroupID,
            subgroupID: null,
            groupShortLabel: selectedGroup.shortLabel,
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
    changeTime(hourOrMinute, value, startOrEnd) {
        let archivedReport = merge({}, this.state.archivedReport);
        let newValue = archivedReport[startOrEnd].split(':');
        value = (value < 10) ? ('0' + value) : value;
        newValue[(hourOrMinute === 'hour') ? 0 : 1] = value;
        archivedReport[startOrEnd] = newValue.join(':');
        // console.log('set user state: changeTime');
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
        this.setState({
            currentPassword: password
        });
    }
    changeNewPasswordPref(password) {
        this.setState({
            newPassword: password
        });
    }
    changeConfirmNewPasswordPref(password) {
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
