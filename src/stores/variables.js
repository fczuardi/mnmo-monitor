import {Store} from 'flummox';
import URLs from '../../config/endpoints.js';
import {
    authHeaders,
    chooseTextOrJSON,
    parseVariables
} from '../../config/apiHelpers';
import pluck from 'lodash/collection/pluck';
import keys from 'lodash/object/keys';

class VariablesStore extends Store {
    constructor(flux) {
        super();
        const sessionStore = flux.getStore('session');
        const sessionActions = flux.getActions('session');
        const varsActions = flux.getActions('vars');
        const userActions = flux.getActions('user');
        this.varsActions = varsActions;
        this.register(sessionActions.tokenGranted, this.fetchVars);
        this.register(varsActions.changePrimarySelection, this.firstVarChange);
        this.register(varsActions.changeSecondarySelection, this.secondVarChange);
        this.register(userActions.variableComboUpdate, this.updateCombo);
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
        this.fetchVars(sessionStore.state.token);
    }

    fetchVars(token) {
        let store = this;
        if (token === null){ return false; }
        console.log('GET', URLs.filters.variables);
        fetch(URLs.baseUrl + URLs.filters.variables, {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then(chooseTextOrJSON)
        .then(function(payload){
            console.log('result', payload);
            let newCombos = parseVariables(payload).combos;
            // console.log('newCombos', newCombos);
            let primaryOptions = keys(newCombos);
            // console.log('primaryOptions', primaryOptions);
            let userState = store.flux.getStore('user').state;
            // let userPrimary = userState.primaryVarLabel;
            // console.log('userPrimary', userPrimary);
            // console.log('variableComboID', userState.variableComboID);
            // let secondaryOptions = newCombos[userPrimary];
            // console.log('secondaryOptions', secondaryOptions);
            let newState = {
                combos: newCombos,
                primary: primaryOptions
            };
            // console.log('newState', newState);
            store.setState(newState);
            if (userState.variableComboID !== null){
                store.updateCombo(userState.variableComboID);
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
        this.setState({
            combo:{
                first: label,
                second: secondOption,
                comboID: comboID
            },
            secondary: pluck(secondOptions, 'label')
        });
    }
    
    secondVarChange(label) {
        let secondOptions = this.state.combos[this.state.combo.first],
            secondOption = label,
            comboID;
        secondOptions.forEach(function(el) {
            if (el.label === label) {
                comboID = el.id;
            }
        });
        this.setState({
            combo:{
                first: this.state.combo.first,
                second: secondOption,
                comboID: comboID
            },
        });
    }
    
    updateCombo(comboID){
        if (this.state.combos === null) { return false; }
        let combo = {},
            secondary = [];
        for (var i in this.state.combos){
            for (var j in this.state.combos[i]){
                let item = this.state.combos[i][j];
                if (item.id === comboID){
                    combo = {
                        first: i,
                        second: item.label,
                        comboID: comboID
                    };
                    secondary = pluck(this.state.combos[i], 'label');
                }
            }
        }
        this.setState({
            combo: combo,
            secondary: secondary
        });
    }

}

export default VariablesStore;
