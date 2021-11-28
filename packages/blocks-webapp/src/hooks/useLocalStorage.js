import {useState} from 'react';
import isEmbedded from '../utils/isEmbedded';

// Derived from: https://usehooks.com/useLocalStorage/

const storage = isEmbedded() ? {} : window.localStorage;

export default function useLocalStorage(key, defaultValue) {
    const [storedValue, setStoredValue] = useState(() => {
        const item = storage[key];
        return item ? JSON.parse(item) : defaultValue;
    });

    return [
        storedValue,
        value => {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            storage[key] = JSON.stringify(valueToStore);
        },
    ];
}