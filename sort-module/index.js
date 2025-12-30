function sortStringsIgnoreSpaces(arr) {
    if (!Array.isArray(arr)) {
        throw new TypeError('Ожидается массив строк');
    }
    
    return arr
        .map((str, index) => ({ 
            original: str, 
            cleaned: String(str).replace(/\s+/g, ''),
            index: index
        }))
        .sort((a, b) => {
            const compareResult = a.cleaned.localeCompare(b.cleaned);
            return compareResult !== 0 ? compareResult : a.original.localeCompare(b.original);
        })
        .map(item => item.original);
}

function sortObjectsByPropertyIgnoreSpaces(arr, prop) {
    if (!Array.isArray(arr)) {
        throw new TypeError('Ожидается массив объектов');
    }
    
    return arr
        .map((obj, index) => ({
            original: obj,
            cleaned: String(obj[prop] || '').replace(/\s+/g, ''),
            index: index
        }))
        .sort((a, b) => {
            const compareResult = a.cleaned.localeCompare(b.cleaned);
            return compareResult !== 0 ? compareResult : a.index - b.index;
        })
        .map(item => item.original);
}

module.exports = {
    sortStringsIgnoreSpaces,
    sortObjectsByPropertyIgnoreSpaces
};