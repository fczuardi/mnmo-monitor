import {Flummox} from 'flummox';

import CountryActions from './actions/country';
import CountryStore from './stores/country';
import UserActions from './actions/user';
import UserStore from './stores/user';
import LoginValidationActions from './actions/loginValidation';
import LoginValidationStore from './stores/loginValidation';
import SessionActions from './actions/session';
import SessionStore from './stores/session';
import LanguageStore from './stores/language';
import UIStore from './stores/ui';
import ColumnsActions from './actions/columns';
import ColumnsStore from './stores/columns';
import GroupsStore from './stores/groups';
import GroupsActions from './actions/groups';



class MonitorFlux extends Flummox {

    constructor() {
        super();
        //note: remember to define actions before stores

        //actions
        this.createActions('country', CountryActions);
        this.createActions('user', UserActions);
        this.createActions('session', SessionActions);
        this.createActions('loginValidation', LoginValidationActions);
        this.createActions('columns', ColumnsActions);
        this.createActions('groups', GroupsActions);

        //stores
        this.createStore('country', CountryStore, this);
        this.createStore('session', SessionStore, this);
        this.createStore('groups', GroupsStore, this);
        this.createStore('user', UserStore, this);
        this.createStore('loginValidation', LoginValidationStore, this);
        this.createStore('language', LanguageStore, this);
        this.createStore('ui', UIStore, this);
        this.createStore('columns', ColumnsStore, this);
    }

}

export default MonitorFlux;
