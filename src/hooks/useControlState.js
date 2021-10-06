import {useContext, useState} from 'react';
import useListener from './useListener';
import EventsContext, {EDITOR_PROCESS_EVENT} from '../contexts/EventsContext';

export default function useControlState({control}) {
    let events = useContext(EventsContext);
    let value = control.getValue();
    let [, updateVisualValue] = useState(value); // Redraw component if value changed
    useListener(events, EDITOR_PROCESS_EVENT, () => updateVisualValue(control.getValue()));

    return [
        value,
        value => control.setValue(value),
    ];
}
