import {Store} from 'flummox';

const submitLabelKeys = {
    change: 'change'
};

class PasswordValidationStore extends Store {
    // constructor(flux) {
    constructor() {
        super();
        this.state = {
            submitLabelKey: submitLabelKeys.change,
            canSubmit: true
        };
    }
}

export default PasswordValidationStore;
