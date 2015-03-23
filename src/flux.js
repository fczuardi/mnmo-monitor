import {Flummox} from 'flummox';
import CountryActions from './actions/country';
import CountryStore from './stores/country';


class MonitorFlux extends Flummox {
    
    constructor() {
        super();
        this.createActions('country', CountryActions);
        this.createStore('country', CountryStore, this);
    }
    
}

export default MonitorFlux;