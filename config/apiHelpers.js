import queryString from 'query-string';

function buildSignInRequestBody(validationStore, userStore){
    let body = {};
    body.username = userStore.state.username;
    body.password = userStore.state.password;
    body.captchaID = validationStore.state.captchaQuestionID;
    body.captchaAnswer = userStore.state.captchaAnswer;
    body.countryID = userStore.state.countryID;
    return queryString.stringify(body);
}

function genericParse(text){
    return ((typeof text === 'string') ? JSON.parse(text) : text);
}

export default {
    buildSignInRequestBody: buildSignInRequestBody,
    parseCountryList: genericParse,
    parseCaptchaSetup: genericParse,
    parseLoginResponse: genericParse
};
