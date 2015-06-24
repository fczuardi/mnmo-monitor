import {Actions} from 'flummox';

class UserActions extends Actions {
    usernameInput(username) {
        return username;
    }
    passwordInput(password) {
        return password;
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
    preferencesPublished(preferences) {
        return preferences;
    }
    preferencesFetched(preferences) {
        return preferences;
    }
    menuVisibilityToggle() {
        return true;
    }
    openSubmenu(name) {
        return name;
    }
    closeSubmenu() {
        return null;
    }
    openPanel(name) {
        return name;
    }
    closePanel() {
        return null;
    }
    tableScroll(top, left){
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
    errorArrived(message) {
        return message;
    }
    errorDismissed() {
        return null;
    }
}

export default UserActions;
