import {Store} from 'flummox';
import URLs from '../../config/endpoints.js';
import {
    authHeaders,
    statusRouter,
    chooseTextOrJSON,
    parseVariables
} from '../../config/apiHelpers';
import pluck from 'lodash/collection/pluck';
import keys from 'lodash/object/keys';

class VariablesStore extends Store {
    constructor(flux) {
        super();
        const sessionStore = flux.getStore('session');
        const varsActions = flux.getActions('vars');
        const userActions = flux.getActions('user');
        const sessionActions = flux.getActions('session');
        this.varsActions = varsActions;
        this.sessionActions = sessionActions;
        this.sessionStore = sessionStore;
        this.register(userActions.preferencesFetched, this.userPreferencesFetched);
        this.register(varsActions.changePrimarySelection, this.firstVarChange);
        this.register(varsActions.changeSecondarySelection, this.secondVarChange);
        this.state = {
            combos: null,
            primary: [],
            secondary: [],
            combo: {
                first: '-',
                second: '-',
                comboID: null
            }
        };
        this.flux = flux;
    }

    userPreferencesFetched(pref) {
        this.updateCombo(parseInt(pref.variableComboID));
        this.fetchVars(this.sessionStore.state.token);
    }
    
    fetchVars(token) {
        let store = this;
        if (token === null){ return false; }
        console.log('GET', URLs.filters.variables);
        fetch(URLs.baseUrl + URLs.filters.variables, {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then((response) => statusRouter(response, store.sessionActions.signOut))
        .then(chooseTextOrJSON)
        .then(function(payload){
            // console.log('result', URLs.filters.variables, payload);
            console.log('OK', URLs.filters.variables);
            let newCombos = parseVariables(payload).combos;
            let primaryOptions = keys(
                                    newCombos
                                ).map( 
                                    (label) => ({ label: label, value: label}) 
                                );
            let userState = store.flux.getStore('user').state;
            let newState = {
                combos: newCombos,
                primary: primaryOptions
            };
            if (userState.variableComboID !== null){
                store.updateCombo(userState.variableComboID, newState);
            }else {
                store.setState(newState);
            }
        })
        .catch(function(e){
            console.log('parsing failed', e); // eslint-disable-line
        });
    }
    
    firstVarChange(label) {
        let secondOptions = this.state.combos[label],
            secondOption = '-',
            comboID = secondOptions[0].id,
            previousSecond = this.flux.getStore('user').state.secondaryVarLabel;
        secondOptions.forEach(function(el) {
            if (el.label === previousSecond) {
                secondOption = previousSecond;
                comboID = el.id;
            }
        });
        this.updateCombo(comboID);
    }
    
    secondVarChange(label) {
        let secondOptions = this.state.combos[this.state.combo.first],
            comboID;
        secondOptions.forEach(function(el) {
            if (el.label === label) {
                comboID = el.id;
            }
        });
        this.updateCombo(comboID);
    }
    
    updateCombo(comboID, newState){
        newState = newState || this.state;
        if (newState.combos === null) { return false; }
        let combo = {},
            secondary = [];
        for (var i in newState.combos){
            for (var j in newState.combos[i]){
                let item = newState.combos[i][j];
                if (item.id === comboID){
                    combo = {
                        first: i,
                        second: item.label,
                        comboID: comboID
                    };
                    secondary = pluck(
                                    newState.combos[i], 'label'
                                ).map( 
                                    (label) => ({ label: label, value: label}) 
                                );
                }
            }
        }
        this.setState({
            combo: combo, 
            combos: newState.combos,
            primary: newState.primary,
            secondary: secondary
        });
    }

}

export default VariablesStore;
