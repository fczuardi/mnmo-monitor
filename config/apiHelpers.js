import queryString from 'query-string';
import merge from 'lodash/object/merge';

const VAR_TYPES = {
    '-': 'number',
    'VarA': 'number',
    'VarB': 'percent',
    'VarC': 'percent'
};
const GROUP_TYPE_LABELS = [
    '',
    'AB',
    'CD'
];

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
    if (response.status === 401){
        callback401();
    }
    if (response.status === 500){
        console.log('status 500');
    }
    return response;
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
    return {
        prefs: lastUserPreferenceResponse,
        error: null
    };
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
    body.subgroupID = state.subgroupID;
    body.classID = state.classID;
    body.primaryVarLabel = state.primaryVarLabel;
    body.secondaryVarLabel = state.secondaryVarLabel;
    body.variableComboID = state.variableComboID;
    return JSON.stringify(body);
}
function buildUserPasswordPostBody(state){
    let body = {
        currentPassword: state.currentPassword,
        newPassword: state.newPassword
    };
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
    let output = {
        data: null,
        error: null
    };
    if (!result){
        console.log('Not the expected response', payload);
        output.error = payload.Message;
    } else {
        lastUserPreferenceResponse = response;
    }
    output.data = parseUserPreferences(lastUserPreferenceResponse).prefs;
    return output;
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
function passwordChangePostResponseOK(payload){
    return payload;
}

export default {
    varTypes: VAR_TYPES,
    groupTypeLabels: GROUP_TYPE_LABELS,
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
    parseSubGroups: parseGroups,
    parseVariables: parseVariables,
    parseRows: genericParse,
    parseFrequencies: genericParse,
    parseCalendar: genericParse,
    parseDayLimits: genericParse,
    buildSignInRequestBody: buildSignInRequestBody,
    buildUserPreferencesPostBody: buildUserPreferencesPostBody,
    buildUserPasswordPostBody: buildUserPasswordPostBody,
    buildColumnsListPostBody: buildColumnsListPostBody,
    diffUserPreferences: diffUserPreferences,
    diffColumnsList: diffColumnsList,
    userPreferencesPostResponseOK: userPreferencesPostResponseOK,
    passwordChangePostResponseOK: passwordChangePostResponseOK,
    forgotPasswordPostResponseOK: passwordChangePostResponseOK,
    columnListPostResponseOK: columnListPostResponseOK
};
