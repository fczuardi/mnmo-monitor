import {Store} from 'flummox';
import URLs from '../../config/endpoints.js';
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
        console.log('GET', URLs.country.list);
        fetch(URLs.baseUrl + URLs.country.list)
        .then(chooseTextOrJSON)
        .then(function(payload){
            console.log('OK', URLs.country.list);
            let options = parseCountryList(payload);
            store.setState({
                options: options
            });
        })
        .catch(function(e){
            console.log('parsing failed ' + URLs.country.list, e); // eslint-disable-line
        });
    }
}

export default CountryStore;
