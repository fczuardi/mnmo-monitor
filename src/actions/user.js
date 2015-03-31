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
}

export default UserActions;
