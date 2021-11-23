// Lightweight observable value implementation
// Derived from: https://stackoverflow.com/a/62002044

class ObservableValue {
    constructor(value) {
        this._value = value;
        this._listeners = [];
    }

    get() {
        return this._value;
    }

    set(newValue) {
        if(this._value === newValue) {
            return;
        }
        this._value = newValue;
        this._listeners.forEach(fn => fn(this._value));
    }

    subscribe(listenerFn) {
        this._listeners.push(listenerFn);
        return () => this.unsubscribe(listenerFn);
    }

    unsubscribe(listenerFn) {
        this._listeners = this._listeners.filter(fn => fn !== listenerFn);
    }
}

export default function makeObservable(target) {
    return new ObservableValue(target);
}