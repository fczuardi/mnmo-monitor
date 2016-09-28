import {Actions} from 'flummox';

class UserActions extends Actions {
    usernameInput(username) {
        return username;
    }
    passwordInput(password) {
        return password;
    }
    emailInput(email) {
        return email;
    }
    rememberLoginUpdate(shouldRemember) {
        return shouldRemember;
    }
    tosAgreementUpdate(haveAgreed) {
        return haveAgreed;
    }
    autoUpdateToggle(autoUpdateState) {
        return autoUpdateState;
    }
    languageUpdate(languageID) {
        return parseInt(languageID);
    }
    dateUpdated(day) {
        return day;
    }
    monthUpdated(month) {
        return month;
    }
    startHourUpdated(hour) {
        return hour;
    }
    startMinuteUpdated(minute) {
        return minute;
    }
    endHourUpdated(hour) {
        return hour;
    }
    endMinuteUpdated(minute) {
        return minute;
    }
    frequencyUpdated(frequencyID) {
        return parseInt(frequencyID);
    }
    mergeFunctionUpdated(functionID) {
        return parseInt(functionID);
    }
    clearPrintInterval() {
        return null;
    }
    setPrintInterval() {
        return null;
    }
    setPrintStartHour(hour) {
        return hour;
    }
    setPrintStartMinute(minute) {
        return minute;
    }
    setPrintEndHour(hour) {
        return hour;
    }
    setPrintEndMinute(minute) {
        return minute;
    }
    printIntervalRequested() {
        return null;
    }
    preferencesPublished(preferences) {
        return preferences;
    }
    localPreferencesFetched(preferences) {
        return preferences;
    }
    preferencesFetched(preferences) {
        return preferences;
    }
    menuVisibilityToggle() {
        return true;
    }
    chartVisibilityToggle(status) {
        return status;
    }
    openSubmenu(name) {
        return name;
    }
    closeSubmenu() {
        return null;
    }
    openPanel(name, isVisible) {
        return {name: name, isVisible: isVisible};
    }
    closePanel() {
        return null;
    }
    navigateToScreen(name) {
        return name;
    }
    currentPasswordInput(password) {
        return password;
    }
    newPasswordInput(password) {
        return password;
    }
    confirmNewPasswordInput(password) {
        return password;
    }
    changePasswordSubmitted() {
        return null;
    }
    forgotPasswordSubmitted() {
        return null;
    }
    changePasswordPublished(newPassword) {
        return newPassword;
    }
    forgotPasswordAccepted() {
        return null;
    }
    tableScroll(top, left){
        return {
            top: top,
            left: left
        };
    }
    secondTableScroll(top, left){
        return {
            top: top,
            left: left
        };
    }
    sliderScroll(percent){
        return percent;
    }
    tableScrollEnded() {
        return null;
    }
    errorArrived(message, tryAgainAction, isWarning) {
        return {
            message: message,
            tryAgainAction: tryAgainAction || null,
            warning: isWarning || null
        };
    }
    errorDismissed() {
        return null;
    }
    printRequested() {
        return null;
    }
    splitScreenButtonToggle() {
        return null;
    }
    secondTableEnabled() {
        return null;
    }
    secondTableFormChanged(field, value) {
        return { field, value}
    }
}

export default UserActions;
