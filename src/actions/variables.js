import {Actions} from 'flummox';

class VariablesActions extends Actions {
    changePrimarySelection(label) {
        return label;
    }
    changeSecondarySelection(label) {
        return label;
    }
    updateVars(combo) {
        return combo;
    }
}

export default VariablesActions;
