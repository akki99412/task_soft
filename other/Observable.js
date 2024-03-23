
class IObservable {
    observable
}
class Observable {
    constructor() {
        this.observers = [];
    }

    subscribe(f) {
        this.observers.push(f);
    }

    unsubscribe(f) {
        this.observers = this.observers.filter(subscriber => subscriber !== f);
    }

    notify(data) {
        this.observers.forEach(observer => observer(data));
    }
}
class ObservableDataBase{
    constructor() {
        this.onChangeBroadcaster = new Observable();
        this.onInsertBroadcaster = new Observable();
        this.onLoadBroadcaster = new Observable();
    }
    change({}) {
        console.log('This function does not override.');
    }
    insert({ }) {
        console.log('This function does not override.');
    }
    load() {
        console.log('This function does not override.');
    }
}