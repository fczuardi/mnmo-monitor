import {Actions} from 'flummox';

class CountryActions extends Actions {
    select(countryID) {
        console.log('action country select executed');
        return countryID;
    }
}

export default CountryActions;