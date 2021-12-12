import {useContext, useState} from 'react';
import useListener from './useListener';
import EventsContext, {EDITOR_CHANGE_EVENT} from '../../contexts/EventsContext';

export default function useControlValue(control) {
    const value = control.getValue();
    const [, updateVisualValue] = useState(value); // updateVisualValue(..): redraw component if value changed

    const events = useContext(EventsContext);
    useListener(events, EDITOR_CHANGE_EVENT, () => {
        updateVisualValue(control.getValue());
        control.notifyEditorChange?.();
    });

    useListener(control.events, 'update', () => events.emit(EDITOR_CHANGE_EVENT, control, value));

    return [
        value,
        value => control.setValue(value),
    ];
}
