import {Store} from 'flummox';
import URLs from '../../config/endpoints.js';
import {
    authHeaders,
    chooseTextOrJSON
} from '../../config/apiHelpers';

class VariablesStore extends Store {
    constructor(flux) {
        super();
        const sessionStore = flux.getStore('session');
        const sessionActions = flux.getActions('session');
        const varsActions = flux.getActions('vars');
        this.varsActions = varsActions;
        this.register(sessionActions.tokenGranted, this.fetchVars);
        this.register(varsActions.changePrimarySelection, this.firstVarChange);
        this.state = {
            combos: {
                VarA: [
                    {
                        label: '-',
                        id: 1
                    },
                    {
                        label: 'VarB',
                        id: 4
                    },
                    {
                        label: 'VarC',
                        id: 5
                    }
                ],
                VarB: [
                    {
                        label: '-',
                        id: 2
                    },
                    {
                        label: 'VarC',
                        id: 6
                    }
                ],
                VarC: [
                    {
                        label: '-',
                        id: 3
                    }
                ]
            },
            primary: [
                'VarA',
                'VarB',
                'VarC'
            ],
            secondary: [
                '-',
                'VarA',
                'VarB',
                'VarC'
            ],
            combo: {
                first: 'VarA',
                second: 'VarC',
                comboID: 5
            }
        };
        this.flux = flux;
        this.fetchVars(sessionStore.state.token);
        // this.addListener('change', this.stateChange);
    }

    fetchVars(token) {
        // let store = this;
        if (token === null){ return false; }
        console.log('GET', URLs.filters.variables);
        fetch(URLs.baseUrl + URLs.filters.variables, {
            method: 'GET',
            headers: authHeaders(token)
        })
        .then(chooseTextOrJSON)
        .then(function(payload){
            console.log('result', payload);
            // let newState = parseVariables(payload).combos;
            // store.setState(newState);
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
        console.log('first var changed to', label, secondOption, comboID);
        this.setState({
            combo:{
                first: label,
                second: secondOption,
                comboID: comboID
            }
        });
    }
    
    stateChange() {
        console.log('stateChange', this.state.combo);
        this.varsActions.updateVars(this.state.combo);
    }
}

export default VariablesStore;
