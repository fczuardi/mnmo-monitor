import queryString from 'query-string';
import merge from 'lodash/object/merge';


let lastUserPreferenceResponse = null;

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
function parseUserPreferences(payload){
    lastUserPreferenceResponse = genericParse(payload);
    return lastUserPreferenceResponse;
}
function buildUserPreferencesPostBody(state){
    let body = merge({}, lastUserPreferenceResponse);
    body.languageID = state.languageID;
    body.autoUpdate = state.autoUpdate;
    return JSON.stringify(body);
}
function diffUserPreferences(state){
    if (lastUserPreferenceResponse === null){ return false; }
    let previousString = JSON.stringify(lastUserPreferenceResponse),
    newString = buildUserPreferencesPostBody(state);
    console.log('diff', (previousString !== newString));
    return (previousString !== newString);
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
        'Authorization': 'Bearer '+ token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
}
export default {
    buildSignInRequestBody: buildSignInRequestBody,
    diffUserPreferences: diffUserPreferences,
    buildUserPreferencesPostBody: buildUserPreferencesPostBody,
    parseUserPreferences: parseUserPreferences,
    parseCountryList: genericParse,
    parseCaptchaSetup: genericParse,
    parseLoginResponse: genericParse,
    authHeaders: authHeaders,
    chooseTextOrJSON: chooseTextOrJSON
};
