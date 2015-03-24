import {Store} from 'flummox';
import URLs from '../../config/entrypoints.json';
class CountryStore extends Store {
    constructor(flux) {
        super();
        const countryActions = flux.getActions('country');
        this.register(countryActions.select, this.changeSelection);
        this.state = {
            tosURL: '#',
            options: []
        };
        this.fetchOptions();
    }

    changeSelection(countryID) {
        console.log('TBD: Tos URL state must change', countryID);
    }

    fetchOptions() {
        let store = this;
        /* global fetch */
        /* comes from the polyfill https://github.com/github/fetch */
        fetch(URLs.baseUrl + URLs.country.list)
            .then(function(response) {
                console.log(response);
                return response.json();
            }).then(function(options) {
                console.log('parsed json', options, store);
                store.setState({
                    options: options
                });
            }).catch(function(ex) {
                console.log('parsing failed', ex);
            });
    }
}

export default CountryStore;
