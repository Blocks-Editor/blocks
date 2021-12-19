import {useCallback, useEffect, useState} from 'react';

export default function useObservableState(observable) {
    const [value, setValueState] = useState(observable.get());

    // // Subscribe immediately
    // const unsubscribe = useMemo(() => observable.subscribe(setValueState), [observable]);
    //
    // // Unsubscribe on cleanup
    // useEffect(() => unsubscribe, [unsubscribe]);

    useEffect(() => observable.subscribe(setValueState), [observable]);

    const setValue = useCallback(value => observable.set(value), [observable]);

    return [value, setValue];
}
