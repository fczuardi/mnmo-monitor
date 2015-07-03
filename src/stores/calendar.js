import {Store} from 'flummox';
import moment from 'moment';
import merge from 'lodash/object/merge';
import URLs from '../../config/endpoints.js';
import {
    authHeaders,
    statusRouter,
    chooseTextOrJSON,
    parseCalendar,
    parseDayLimits
} from '../../config/apiHelpers';

const today = moment();
class CalendarStore extends Store {
    constructor(flux) {
        super();
        const userActions = flux.getActions('user');
        this.register(userActions.preferencesFetched, this.userPrefFetched);
        this.register(userActions.monthUpdated, this.fetchDays);
        this.sessionStore = flux.getStore('session');
        this.userStore = flux.getStore('user');
        this.sessionActions = flux.getActions('session');
        this.state = {
            months: {},
            firstMinute: '00:00:00',
            lastMinute: '23:59:59',
            minutesInADay: 1440,
        };
    }
    
    userPrefFetched(pref) {
        let dateString = (pref.archivedReport && 
                            pref.archivedReport.date) ? 
                                            pref.archivedReport.date : 
                                            today.format('YYYY-MM-DD');
        this.fetchDays(dateString);
        this.fetchDayLimits();
    }

    fetchDays(dateString) {
        let store = this;
        let token = this.sessionStore.state.token;
        if (token === null){ return false; }
        let dateParts = dateString.split('-');
        let url = URLs.baseUrl + 
                    URLs.calendar.days + '?' + 
                    URLs.calendar.monthParam + '=' + dateParts[1] + '&' +
                    URLs.calendar.yearParam + '=' + dateParts[0];
        console.log('GET', URLs.calendar.days);
        fetch(url, {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then((response) => statusRouter(response, store.sessionActions.signOut))
        .then(chooseTextOrJSON)
        .then(function(payload){
            console.log('OK', URLs.calendar.days);
            // console.log('result', payload);
            let stateUpdate = parseCalendar(payload);
            let newState = merge(store.state, stateUpdate);
            store.setState(newState);
        })
        .catch(function(e){
            console.log('fetch error ' + URLs.calendar.days, e); // eslint-disable-line
        });
    }
    
    fetchDayLimits() {
        let store = this;
        let token = this.sessionStore.state.token;
        if (token === null){ return false; }
        let countryID = this.userStore.state.countryID;
        let url = URLs.baseUrl + 
                    URLs.calendar.dayLimits + '?' + 
                    URLs.calendar.countryParam + '=' + countryID;
        console.log('GET', URLs.calendar.dayLimits);
        fetch(url, {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then((response) => statusRouter(response, store.sessionActions.signOut))
        .then(chooseTextOrJSON)
        .then(function(payload){
            console.log('OK', URLs.calendar.dayLimits);
            // console.log('result', payload);
            let stateUpdate = parseDayLimits(payload);
            // console.log('parsed result', stateUpdate);
            store.setState(stateUpdate);
        })
        .catch(function(e){
            console.log('fetch error ' + URLs.calendar.dayLimits, e); // eslint-disable-line
        });
    }
    

}

export default CalendarStore;
