import React from 'react';
import useControlState from '../../../hooks/useControlState';


export default function TextFieldControlHandle(props) {
    let [value, setValue] = useControlState(props);

    return (
        <input
            type="text"
            value={value || ''}
            onChange={event => setValue(event.target.value)}
            onDrag={event => event.stopPropagation()}
        />
    );
}


