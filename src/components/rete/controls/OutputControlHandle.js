import React, {useContext, useState} from 'react';
import EventsContext, {EDITOR_CHANGE_EVENT} from '../../../contexts/EventsContext';
import useListener from '../../../hooks/useListener';
import Loading from '../../Loading';


export default function OutputControlHandle({control, bindInput, query}) {

    let findValue = async () => {
        try {
            return query(control, control.getNode(), control.editor);
        }
        catch(err) {
            console.warn(err);
            return `<${err}>`;
        }
    };

    let [valuePromise, setValuePromise] = useState(findValue);

    let events = useContext(EventsContext);

    useListener(events, EDITOR_CHANGE_EVENT, () => {
        setValuePromise(findValue());
    });

    return (
        <Loading promise={valuePromise}>
            {value => (value ?? null) && (
                <input
                    type="text"
                    className="w-100 small"
                    readOnly
                    ref={bindInput}
                    value={value || ''}
                />
            )}
        </Loading>
    );
}
