// throw out Errors, with global prefix 'Logline: ' ahead of err.message
export function throwError(errMessage) {
    throw new Error('Logline: ' + errMessage);
}

// filter any function in a object
export function filterFunction(obj) {
    var newObj = {}, i;

    if (typeof obj !== 'object') {
        return obj;
    }

    for (i in obj) {
        if (obj.hasOwnProperty(i)) {
            if (typeof obj[i] !== 'function') {
                newObj[i] = filterFunction(obj[i]);
            }
        }
    }
    return newObj;
}
