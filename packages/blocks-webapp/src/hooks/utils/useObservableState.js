import {useEffect, useState} from 'react';

export default function useObservableState(observable) {
    const [value, setValue] = useState(observable.get());

    useEffect(() => observable.subscribe(setValue), [observable]);

    return [
        value,
        (value) => observable.set(value),
    ];
}
