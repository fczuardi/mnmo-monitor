export function getObject(itemName) {
    const itemString = localStorage.getItem(itemName) || null;
    try {
        return JSON.parse(itemString);
    }catch (e) {
        console.log(e);
        return null;
    }
}

export function setObject(itemName, obj) {
    localStorage.setItem(itemName, JSON.stringify(obj));
}
