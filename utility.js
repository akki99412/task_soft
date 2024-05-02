const c = console;
const tee = func => arg => {
    func(arg);
    return arg;
};
const log = tee(c.log);
const isEqualObjectJson = (objectA) => (objectB) => {
    if (typeof (objectA) === "function") {
        return false;
    }
    let buff;
    try { buff = (JSON.stringify(objectA)) === (JSON.stringify(objectB)) }
    catch (e) {
        if (e instanceof TypeError) {
            buff = false
        } else {
            throw e;
        }
    }
    return buff;
};
const loggerTimelines = [];