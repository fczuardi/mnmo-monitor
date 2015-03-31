import {Store} from 'flummox';
import URLs from '../../config/entrypoints.json';
import {
    chooseTextOrJSON,
    parseCountryList
} from '../../config/apiHelpers';

class CountryStore extends Store {
    constructor() {
        super();
        this.state = {
            options: []
        };
        this.fetchOptions();
    }

    fetchOptions() {
        let store = this;
        fetch(URLs.baseUrl + URLs.country.list)
        .then(chooseTextOrJSON)
        .then(function(payload){
            let options = parseCountryList(payload);
            store.setState({
                options: options
            });
        })
        .catch(function(e){
            console.log('parsing failed', e);
        });
    }
}

export default CountryStore;
