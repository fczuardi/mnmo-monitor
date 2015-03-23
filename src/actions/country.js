import {Actions} from 'flummox';

class CountryActions extends Actions {
    select(countryID) {
        return countryID;
    }
}

export default CountryActions;
