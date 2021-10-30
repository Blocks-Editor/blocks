import {useContext, useEffect, useState} from 'react';
import EventsContext, {ERROR_EVENT} from '../../contexts/EventsContext';

export default function Loading({promise, loading, error, children}) {
    let [status, setStatus] = useState('loading');
    let [result, setResult] = useState();

    let events = useContext(EventsContext);

    useEffect(() => {
        Promise.resolve(promise)
            .then(result => {
                setStatus('success');
                setResult(result);
            })
            .catch(err => {
                setStatus('error');
                setResult(err);
                if(!error) {
                    events.emit(ERROR_EVENT, err);
                }
            });
    }, [promise, error, events]);

    if(status === 'loading') {
        return loading?.() ?? null;
    }
    if(status === 'error') {
        return error?.(result) ?? null;
    }
    return children?.(result) ?? null;
}