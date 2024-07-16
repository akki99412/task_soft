let diContainer = new class DiContainer {
    constructor() {
        this.Container = {};
    }
    addForCallByValue(key, val) {
        Object.defineProperty(this.Container, key, { get() { return new val(); } , enumerable: true});
    }
    addForCallByReference(key, val) {
        Object.defineProperty(this.Container, key, { value: val, enumerable: true });
    }
    get container() {
        return Object.fromEntries(Object.keys(this.Container).map((key) => { return [key, this.Container[key]] }));
    }
}();

