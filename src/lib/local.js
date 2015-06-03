function warnLocalStorageSupport(){
    console.warn('your browser dont support localStorage');
    return null;
}
export function getObject(itemName) {
    if (!localStorage) {
        return warnLocalStorageSupport();
    }
    const itemString = localStorage.getItem(itemName) || null;
    try {
        return JSON.parse(itemString);
    }catch (e) {
        console.log(e); // eslint-disable-line
        return null;
    }
}

export function setObject(itemName, obj) {
    if (!localStorage) {
        return warnLocalStorageSupport();
    }
    localStorage.setItem(itemName, JSON.stringify(obj));
}

export function removeObject(itemName) {
    if (!localStorage) {
        return warnLocalStorageSupport();
    }
    localStorage.removeItem(itemName);
}
