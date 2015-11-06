import {Actions} from 'flummox';

class CountryActions extends Actions {
    select(countryID) {
        return parseInt(countryID);
    }
}

export default CountryActions;
