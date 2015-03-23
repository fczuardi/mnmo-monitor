import {Flummox} from 'flummox';

import CountryActions from './actions/country';
import UserActions from './actions/user';

import CountryStore from './stores/country';
import UserStore from './stores/user';


class MonitorFlux extends Flummox {

    constructor() {
        super();
        this.createActions('country', CountryActions);
        this.createActions('user', UserActions);
        this.createStore('country', CountryStore, this);
        this.createStore('user', UserStore, this);
    }

}

export default MonitorFlux;
