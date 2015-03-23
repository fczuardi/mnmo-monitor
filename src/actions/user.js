import {Actions} from 'flummox';

class UserActions extends Actions {
    credentialsInput(username, password) {
        return {username, password}; // jshint ignore:line
    }
    rememberLoginUpdate(shouldRemember) {
        return shouldRemember;
    }
    tosAgreementUpdate(haveAgreed) {
        return haveAgreed;
    }
}

export default UserActions;
