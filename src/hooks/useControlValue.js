import {useCallback, useContext, useState} from 'react';
import useListener from './utils/useListener';
import EventsContext, {EDITOR_CHANGE_EVENT} from '../contexts/EventsContext';

export default function useControlValue(control) {
    const value = control.getValue();
    const [, updateVisualValue] = useState(value); // updateVisualValue(..): redraw component if value changed

    const events = useContext(EventsContext);
    useListener(events, EDITOR_CHANGE_EVENT, () => {
        updateVisualValue(control.getValue());
    });

    useListener(control.events, 'update', () => {
        events.emit(EDITOR_CHANGE_EVENT, control.editor, control);
    });

    const setValue = useCallback(value => control.setValue(value), [control]);

    return [value, setValue];
}
