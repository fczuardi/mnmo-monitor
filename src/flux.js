import {Flummox} from 'flummox';

import CountryActions from './actions/country';
import CountryStore from './stores/country';
import UserActions from './actions/user';
import UserStore from './stores/user';
import LoginValidationActions from './actions/loginValidation';
import LoginValidationStore from './stores/loginValidation';



class MonitorFlux extends Flummox {

    constructor() {
        super();
        this.createActions('country', CountryActions);
        this.createStore('country', CountryStore, this);
        this.createActions('user', UserActions);
        this.createStore('user', UserStore, this);
        this.createActions('loginValidation', LoginValidationActions);
        this.createStore('loginValidation', LoginValidationStore, this);
    }

}

export default MonitorFlux;
