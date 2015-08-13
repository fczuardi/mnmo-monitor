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
    userPreferencesPostResponseOK,
    passwordChangePostResponseOK,
    forgotPasswordPostResponseOK,
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
        this.register(userActions.changePasswordPublished, this.changePasswordPref);
        this.register(userActions.forgotPasswordSubmitted, this.startForgotPassword);
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
        // console.log('set user state: loadSavedPreferences');
        this.setState(preferences);
        this.userActions.languageUpdate(preferences.languageID);
    }
    savePreferences() {
        // console.log('savePreferences');
        let localUserPreference = merge({}, this.state);
        delete localUserPreference.captchaAnswer;
        delete localUserPreference.currentPassword;
        delete localUserPreference.newPassword;
        delete localUserPreference.confirmNewPassword;
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
            let result = parseUserPreferences(payload);
            // console.log('parsed result', result);
            if (result.error !== null) {
                store.userActions.errorArrived(result.error);
                return null;
            }
            let userPreferences = merge({}, result.prefs);
            // console.log('userPreferences', userPreferences);
            store.userActions.preferencesFetched(userPreferences);
        })
        .catch(function(e){
            console.log('fetch error', e); // eslint-disable-line
        });
    }
    preferencesFetched(preferences) {
        // console.log('set user state: preferencesFetched');
        this.setState(preferences);
    }
    publishPasswordChange(){
        // console.log('publishPasswordChange');
        let store = this;
        let token = store.sessionStore.state.token;
        if (token === null){ return false; }
        let postBody = buildUserPasswordPostBody(store.state);
        console.log('POST', URLs.user.password);
        console.log('postBody', postBody);
        fetch(URLs.baseUrl + URLs.user.password, {
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
            console.log('OK (post)', URLs.user.password, payload);
            let result = passwordChangePostResponseOK(payload);
            if (result.error !== null) {
                store.userActions.errorArrived(result.error);
            } else if (result.success){
                store.userActions.changePasswordPublished(store.state.newPassword);
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
            // console.log('result (post)', URLs.user.preferences, payload);
            let result = userPreferencesPostResponseOK(payload),
                newState = result.data;
            // console.log('newState', newState);
            // console.log('post success', payload, newState);
            // userPreferencesPostResponseOK(payload);
            store.userActions.preferencesPublished(newState);
            if (result.error !== null) {
                store.userActions.errorArrived(result.error);
                //userPreferencesPostResponseOK returns the last known-to-work
                //user preferences on error, so we rollback to that
                // console.log('set user state: updatePreferences error');
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
    changeEmailPref(email) {
        console.log('email changed');
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
        // console.log('set user state: changeCountryPref');
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
        // console.log('set user state: changeLanguagePref');
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
        console.log('resetChangePasswordFields');
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
}

export default UserStore;
