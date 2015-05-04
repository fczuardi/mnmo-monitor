import queryString from 'query-string';
import merge from 'lodash/object/merge';


let lastUserPreferenceResponse = null,
    lastColumnsResponse = null;

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
        'Authorization': 'Bearer ' + token,
            'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
}
function statusRouter(response, callback401) {
    if (response.status === 200){
        return response;
    } else {
        if (response.status === 401){
            callback401();
        }
        throw response.status;
    }
}
function diffPayloads(previous, current){
    if (previous === null){ return false; }
    let previousString = JSON.stringify(previous);
    if (previousString !== current) {
        // console.log(previousString);
        // console.log(current);
    }
    return (previousString !== current);
}

function parseUserPreferences(payload){
    lastUserPreferenceResponse = genericParse(payload);
    return lastUserPreferenceResponse;
}
function parseColumnsList(payload){
    lastColumnsResponse = genericParse(payload);
    return lastColumnsResponse;
}
function parseGroups(payload){
    return genericParse(payload);
}
function parseVariables(payload){
    return genericParse(payload);
}

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
function buildUserPreferencesPostBody(state){
    let body = merge({}, lastUserPreferenceResponse);
    body.languageID = state.languageID;
    body.autoUpdate = state.autoUpdate;
    body.archivedReport = state.archivedReport;
    body.mergedRows = state.mergedRows;
    body.groupID = state.groupID;
    body.groupShortLabel = state.groupShortLabel;
    body.classID = state.classID;
    body.primaryVarLabel = state.primaryVarLabel;
    body.secondaryVarLabel = state.secondaryVarLabel;
    body.variableComboID = state.variableComboID;
    return JSON.stringify(body);
}
function buildColumnsListPostBody(state){
    return JSON.stringify(state);
}
function diffUserPreferences(state){
    return diffPayloads(
        lastUserPreferenceResponse, 
        buildUserPreferencesPostBody(state)
    );
}
function diffColumnsList(state){
    // console.log('state', state);
    return diffPayloads(
        lastColumnsResponse, 
        buildColumnsListPostBody(state)
    );
}
function userPreferencesPostResponseOK(payload){
    let response = genericParse(payload),
        result = response.languageID !== undefined;
    if (!result){
        console.log('Not the expected response', payload);
    } else {
        lastUserPreferenceResponse = response;
    }
    return parseUserPreferences(lastUserPreferenceResponse);
}
function columnListPostResponseOK(payload){
    let response = genericParse(payload),
        result = Array.isArray(response.enabled);
    if (!result){
        console.log('Not the expected response', payload);
    } else {
        lastColumnsResponse = response;
    }
    return parseColumnsList(lastColumnsResponse);
}


export default {
    authHeaders: authHeaders,
    statusRouter: statusRouter,
    chooseTextOrJSON: chooseTextOrJSON,
    parseCountryList: genericParse,
    parseCaptchaSetup: genericParse,
    parseLoginResponse: genericParse,
    parseUserPreferences: parseUserPreferences,
    parseLanguages: genericParse,
    parseColumnsList: parseColumnsList,
    parseGroups: parseGroups,
    parseVariables: parseVariables,
    parseRows: genericParse,
    parseFrequencies: genericParse,
    buildSignInRequestBody: buildSignInRequestBody,
    buildUserPreferencesPostBody: buildUserPreferencesPostBody,
    buildColumnsListPostBody: buildColumnsListPostBody,
    diffUserPreferences: diffUserPreferences,
    diffColumnsList: diffColumnsList,
    userPreferencesPostResponseOK: userPreferencesPostResponseOK,
    columnListPostResponseOK: columnListPostResponseOK
};
