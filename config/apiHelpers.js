import queryString from 'query-string';
export function buildSignInRequestBody(validationStore, userStore){
    let body = {};
    body.username = userStore.state.username;
    body.password = userStore.state.password;
    body.captchaID = validationStore.state.captchaQuestionID;
    body.captchaAnswer = userStore.state.captchaAnswer;
    return queryString.stringify(body);
}
