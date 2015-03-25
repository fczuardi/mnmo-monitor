import {Store} from 'flummox';
import URLs from '../../config/entrypoints.json';
import {parseCountryList} from '../../config/apiHelpers';

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
            let contentType = response.headers.get('Content-Type'),
                isJSON = (contentType.indexOf('application/json') > -1);
            if (isJSON) {
                return response.json();
            } else {
                console.warn(`got ${contentType} instead of application/json`);
                return response.text();
            }
        })
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
