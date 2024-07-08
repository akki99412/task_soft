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

function saveTextToFile(text, filename) {
    const blob = new Blob([text], { type: 'text/plain' });
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.click();
}
// const zip=(...array)=>


class Observable {
    constructor(value = null) {
        this.observers = [];
        this.value = value;
    }
    static Op = class {
        static subscribe = (func) => (observable) => observable.observers.push(func);
        static notify = value => observable => {
            observable.value = value;
            c.log(observable.observers);
            observable.observers.forEach(func => func(value));
        }
    }
    subscribe = (func) => Observable.Op.subscribe(func)(this);
    // unsubscribe
    notify = (value) => Observable.Op.notify(value)(this);
}