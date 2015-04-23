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
}

export default UserActions;
