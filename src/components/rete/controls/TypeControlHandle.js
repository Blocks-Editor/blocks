import React from 'react';
import useControlState from '../../../hooks/useControlState';


export default function TypeControlHandle(props) {
    let [value, setValue] = useControlState(props);
    let {bindInput} = props;

    // TODO: dropdown for primitive types

    return (
        <input
            type="text"
            className="w-100"
            placeholder="(Type)"
            ref={bindInput}
            value={value || ''}
            onChange={event => setValue(event.target.value)}
            onDrag={event => event.stopPropagation()}
        />
    );
}
