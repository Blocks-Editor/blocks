import {useContext, useState} from 'react';
import useListener from './useListener';
import EventsContext, {ENGINE_NOTIFY_EVENT} from '../contexts/EventsContext';

export default function useControlState({control}) {
    let value = control.getValue();
    let [, updateVisualValue] = useState(value); // Redraw component if value changed

    let events = useContext(EventsContext);
    // useListener(events, EDITOR_CHANGE_EVENT, () => updateVisualValue(control.getValue()));

    useListener(control.events, 'update', () => updateVisualValue(control.getValue()));

    console.log(':',value)

    return [
        value,
        value => {
            control.setValue(value);
            events.emit(ENGINE_NOTIFY_EVENT, control,value);
        },
    ];
}
