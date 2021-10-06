import React from 'react';
import useControlState from '../../../hooks/useControlState';


export default function CheckboxControlHandle(props) {
    let [value, setValue] = useControlState(props);

    return (
        <input
            type="checkbox"
            value={!!value}
            onChange={event => setValue(event.target.checked)}
        />
    );
}
