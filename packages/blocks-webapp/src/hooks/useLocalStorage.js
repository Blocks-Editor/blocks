import {useState} from 'react';
import isEmbedded from '../utils/isEmbedded';

// Derived from: https://usehooks.com/useLocalStorage/

const storage = isEmbedded() ? {} : window.localStorage;

export default function useLocalStorage(key, defaultValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = storage[key];
            return item ? JSON.parse(item) : defaultValue;
        }
        catch(error) {
            console.error(error);
            return defaultValue;
        }
    });

    return [
        storedValue,
        value => {
            try {
                const valueToStore = value instanceof Function ? value(storedValue) : value;
                setStoredValue(valueToStore);
                storage[key] = JSON.stringify(valueToStore);
            }
            catch(error) {
                console.error(error);
            }
        },
    ];
}