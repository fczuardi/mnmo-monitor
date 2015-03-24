function genericParse(text){
    console.log('generic parse:', text);
    return ((typeof text === 'string') ? JSON.parse(text) : text);
}
export default {
    parseCountryList: genericParse,
    parseCaptchaSetup: genericParse,
    parseLoginResponse: genericParse
};
