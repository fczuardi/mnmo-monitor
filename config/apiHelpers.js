import queryString from 'query-string';

function buildSignInRequestBody(validationStore, userStore){
    let body = {
        username: userStore.state.username,
        password: userStore.state.password,
        captchaID: validationStore.state.captchaQuestionID,
        captchaAnswer: userStore.state.captchaAnswer,
        countryID: userStore.state.countryID
    };
    return queryString.stringify(body);
}
function buildUserPreferencesPostBody(userStore){
    let body = {
        languageID: userStore.state.languageID,
        autoUpdate: userStore.state.autoUpdate,
    };
    return queryString.stringify(body);
}

function genericParse(text){
    return ((typeof text === 'string') ? JSON.parse(text) : text);
}

function chooseTextOrJSON(response) {
    let contentType = response.headers.get('Content-Type'),
        isJSON = (contentType.indexOf('application/json') > -1);
    if (isJSON) {
        return response.json();
    } else {
        console.warn(`got ${contentType} instead of application/json`);
        return response.text();
    }
}


function authHeaders(token){
    return {
        'Authorization': 'Bearer '+ token
    };
}
export default {
    buildSignInRequestBody: buildSignInRequestBody,
    buildUserPreferencesPostBody: buildUserPreferencesPostBody,
    parseCountryList: genericParse,
    parseCaptchaSetup: genericParse,
    parseLoginResponse: genericParse,
    parseUserPreferences: genericParse,
    authHeaders: authHeaders,
    chooseTextOrJSON: chooseTextOrJSON
};
