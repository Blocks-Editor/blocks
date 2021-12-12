import {useEffect, useMemo, useState} from 'react';

// Use an object {K: V} constructed from {K: Observable<V>}
export default function useObjectObservable(object) {
    const [result, setResult] = useState({});

    console.log(result)//////

    const unsubscribe = useMemo(() => {
        const callbacks = [];
        for(const [key, observable] of Object.entries(object)) {
            result[key] = observable.get();
            callbacks.push(observable.subscribe(value => setResult({...result, [key]: value})));
        }
        return () => callbacks.forEach(callback => callback());
    }, [object, result]);

    useEffect(() => unsubscribe, [unsubscribe]);
    return result;
}
