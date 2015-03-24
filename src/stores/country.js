import {Store} from 'flummox';
import URLs from '../../config/entrypoints.json';
import {parseCountryList} from '../../config/responseParsers';

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
        /* global fetch */
        /* comes from the polyfill https://github.com/github/fetch */
        fetch(URLs.baseUrl + URLs.country.list)
        .then(function(response) {
            if (response.ok) {
                return response.text();
            }
        })
        .then(function (text) {
            let options = parseCountryList(text); 
            store.setState({
                options: options
            });
        });
    }
}

export default CountryStore;
