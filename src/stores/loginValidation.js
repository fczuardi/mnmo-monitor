import {Store} from 'flummox';
import URLs from '../../config/entrypoints.json';
import {parseCaptchaSetup} from '../../config/responseParsers';

const submitLabelKeys = {
    loading: 'loading',
    missingUsername: 'missingUsername',
    missingPassword: 'missingPassword',
    missingTos: 'missingTos',
    missingCaptcha: 'missingCaptcha',
    access: 'access'
};

class LoginValidationStore extends Store {
    constructor(flux) {
        super();
        this.state = {
            captchaQuestion: null,
            captchaAnswers: [],
            submitLabelKey: submitLabelKeys.access,
            canSubmit: false
        };
        this.userStore = flux.getStore('user');
        this.userStore.addListener('change', this.validate.bind(this));
        this.validate();
        this.fetchCaptcha();
    }
    validate() {
        console.log('validate');
        let userData = this.userStore.state;
        if (userData.username.trim().length === 0){
            this.setState({
                canSubmit: false,
                submitLabelKey: submitLabelKeys.missingUsername
            });
        } else if (userData.password.trim().length === 0){
            this.setState({
                canSubmit: false,
                submitLabelKey: submitLabelKeys.missingPassword
            });
        } else if (userData.tosAgree === false){
            this.setState({
                canSubmit: false,
                submitLabelKey: submitLabelKeys.missingTos
            });
        } else {
            this.setState({
                canSubmit: true,
                submitLabelKey: submitLabelKeys.access
            });
        }
    }
    fetchCaptcha() {
        let store = this;
        /* global fetch */
        /* comes from the polyfill https://github.com/github/fetch */
        fetch(URLs.baseUrl + URLs.validation.captcha)
        .then(function(response) {
            response.json().then(function(json) {
                let options = parseCaptchaSetup(json);
                store.setState({
                    captchaQuestion: options.question,
                    captchaAnswers: options.answers
                });
            }).catch(function(ex) {
                console.log('parsing failed', ex);
            });
            //HACK to make response.json work on firefox
            response.text().catch(function(){});
        });
    }
}

export default LoginValidationStore;
