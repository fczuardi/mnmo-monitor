import {Store} from 'flummox';
class SessionStore extends Store {
    constructor(flux) {
        super();
        const sessionActions = flux.getActions('session');
        this.register(sessionActions.signIn, this.signIn);
    }
    signIn(form){
        console.log('get a session token', form);
    }
}

export default SessionStore;
