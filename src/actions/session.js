import {Actions} from 'flummox';

class SessionActions extends Actions {
    signIn(form) {
        return form;
    }
    signOut() {
        return true;
    }
}

export default SessionActions;
