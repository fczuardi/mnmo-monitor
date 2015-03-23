import {Store} from 'flummox';

class CountryStore extends Store {
    constructor(flux) {
        super();
        const countryActions = flux.getActions('country');
        this.register(countryActions.select, this.changeSelection);
        this.state = {
            selected: null,
            tosURL: '#',
            options: []
        };
        this.fetchOptions();
    }

    changeSelection(countryID) {
        console.log('country changed:', countryID);
        this.setState({
            selected: countryID    
        });
    }
    
    fetchOptions() {
        console.log('get country options from the api');
    }
}

export default CountryStore;