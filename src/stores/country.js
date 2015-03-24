import {Store} from 'flummox';
import URLs from '../../config/entrypoints.json';
import {parseCountryList} from '../../config/responseParsers';

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
            if (response.ok) {
                return response.text();
            }
        })
        .then(function (text) {
            console.log(parseCountryList(text));
            store.setState({
                options: parseCountryList(text)
            });
        });
    }
}

export default CountryStore;
