import React, {useContext, useState} from 'react';
import EventsContext, {ERROR_EVENT} from '../contexts/EventsContext';
import useListener from '../hooks/useListener';
import {Toast} from 'react-bootstrap';

export default function ErrorBanner() {
    let [errors, setErrors] = useState([]);

    let events = useContext(EventsContext);

    useListener(events, ERROR_EVENT, err => {
        setErrors([...errors, err]);
    });

    // (Untested wonderland)

    return (
        <div style={{position: 'static', left: 0, right: 0}}>
            {errors.map((err, i) => (
                <Toast key={err.toString()} onClose={() => errors.splice(i, 1)}>
                    <Toast.Header>
                        Error!
                    </Toast.Header>
                    <Toast.Body>
                        {err.message || err}
                    </Toast.Body>
                </Toast>
            ))}
        </div>
    );
}