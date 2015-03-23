import {Store} from 'flummox';

class CountryStore extends Store {
    constructor(flux) {
        super();
        const countryActions = flux.getActions('country');
        this.register(countryActions.select, this.changeSelection);
        this.state = {
            selected: null,
            tosURL: '#'
        };
    }

    changeSelection(countryID) {
        console.log('country changed:', countryID);
        this.setState({
            selected: countryID    
        });
    }
}

export default CountryStore;