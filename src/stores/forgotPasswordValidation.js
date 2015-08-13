import {Store} from 'flummox';

const submitLabelKeys = {
    send: 'send'
};

class ForgotPasswordValidationStore extends Store {
    // constructor(flux) {
    constructor() {
        super();
        this.state = {
            submitLabelKey: submitLabelKeys.send,
            canSubmit: true
        };
    }
}

export default ForgotPasswordValidationStore;
