import {useEffect, useMemo, useState} from 'react';

export default function useObservableState(observable) {
    const [value, setValue] = useState(observable.get());

    // Subscribe immediately
    const unsubscribe = useMemo(() => observable.subscribe(setValue), [observable]);

    // Unsubscribe on cleanup
    useEffect(() => unsubscribe, [unsubscribe]);

    return [
        value,
        (value) => observable.set(value),
    ];
}
