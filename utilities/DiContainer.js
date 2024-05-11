let diContainer = new class DiContainer {
    constructor() {
        this._container = {};
    }
    addForCallByValue(key, val) {
        Object.defineProperty(this._container, key, { get() { return new val(); } , enumerable: true});
    }
    addForCallByReference(key, val) {
        Object.defineProperty(this._container, key, { value: val, enumerable: true });
    }
    get container() {
        return Object.fromEntries(Object.keys(this._container).map((key) => { return [key, this._container[key]] }));
    }
}();

