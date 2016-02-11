import {Actions} from 'flummox';

class SessionActions extends Actions {
    signIn(form) {
        return form;
    }
    signOut() {
        return true;
    }
    tokenGranted(token) {
        return token;
    }
    refreshDataLoaded(refreshData) {
        return refreshData;
    }
}

export default SessionActions;
