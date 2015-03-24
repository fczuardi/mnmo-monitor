import {Flummox} from 'flummox';

import CountryActions from './actions/country';
import CountryStore from './stores/country';
import UserActions from './actions/user';
import UserStore from './stores/user';
import LoginValidationActions from './actions/loginValidation';
import LoginValidationStore from './stores/loginValidation';
import SessionActions from './actions/session';
import SessionStore from './stores/session';



class MonitorFlux extends Flummox {

    constructor() {
        super();
        //note: remember to define actions before stores 

        //actions
        this.createActions('country', CountryActions);
        this.createActions('user', UserActions);
        this.createActions('loginValidation', LoginValidationActions);
        this.createActions('session', SessionActions);

        //stores
        this.createStore('country', CountryStore, this);
        this.createStore('user', UserStore, this);
        this.createStore('loginValidation', LoginValidationStore, this);
        this.createStore('session', SessionStore, this);
    }

}

export default MonitorFlux;
