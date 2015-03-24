import {Actions} from 'flummox';

class LoginValidationActions extends Actions {
    captchaAnswered(answer){
        return answer;
    }
}

export default LoginValidationActions;
