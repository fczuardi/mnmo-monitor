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
            response.json().then(function(json) {
                let options = parseCountryList(json);
                store.setState({
                    options: options
                });
            }).catch(function(ex) {
                console.log('parsing failed', ex);
            });
            //HACK to make response.json work on firefox
            response.text().catch(function(){});
        });
    }
}

export default CountryStore;
