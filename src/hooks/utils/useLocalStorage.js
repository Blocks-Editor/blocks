import isEmbedded from '../../utils/isEmbedded';
import useObservableState from './useObservableState';
import makeObservable from '../../utils/makeObservable';
import {useCallback} from 'react';

// Derived from: https://usehooks.com/useLocalStorage/

const storage = isEmbedded() ? {} : window.localStorage;

const observableMap = new Map();

export function makeLocalStorageObservable(key, defaultValue) {
    if(observableMap.has(key)) {
        // throw new Error(`Local storage observable already exists for key: ${key}`);
        return observableMap.get(key);
    }
    let observable;
    try {
        const item = storage[key];
        observable = makeObservable(item ? JSON.parse(item) : defaultValue);
    }
    catch(error) {
        console.error(error);
        observable = makeObservable(defaultValue);
    }
    observableMap.set(key, observable);
    observable.subscribe(value => {
        if(value !== undefined) {
            storage[key] = JSON.stringify(value);
        }
        else {
            delete storage[key];
        }
    });
    return observable;
}

export default function useLocalStorage(key, defaultValue) {

    // Find or create global observable value for key
    const observable = observableMap.get(key) || makeLocalStorageObservable(key, defaultValue);

    const [storedValue, setStoredValue] = useObservableState(observable);

    const setValue = useCallback(value => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
        }
        catch(error) {
            console.error(error);
        }
    }, [storedValue, setStoredValue]);

    return [
        storedValue,
        setValue,
        // observable,
    ];
}