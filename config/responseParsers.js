export function parseCountryList(text){
    return ((typeof text === 'string') ? JSON.parse(text) : text);
}

export function parseCaptchaSetup(text){
    return ((typeof text === 'string') ? JSON.parse(text) : text);
}