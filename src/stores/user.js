import {Store} from 'flummox';
class UserStore extends Store {
    constructor(flux) {
        super();
        const userActions = flux.getActions('user');
        this.register(userActions.rememberLoginUpdate, this.changeRememberPref);
        this.register(userActions.tosAgreementUpdate, this.changeTosPref);
        this.state = {
            username: null,
            password: null,
            rememberLogin: false,
            tosAgree: false
        };
    }

    changeRememberPref(shouldRemember) {
        this.setState({
            rememberLogin: shouldRemember
        });
    }

    changeTosPref(haveAgreed) {
        this.setState({
            tosAgree: haveAgreed
        });
    }
}

export default UserStore;
