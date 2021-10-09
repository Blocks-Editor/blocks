import React from 'react';
import useControlState from '../../../hooks/useControlState';
import getDefaultLabel from '../../../utils/getDefaultLabel';


export default function TypeControlHandle(props) {
    let [value, setValue] = useControlState(props);
    let {} = props;

    // TODO: dropdown for primitive types

    return (
        <input
            type="text"
            className="w-100"
            value={value || ''}
            placeholder="(Type)"
            onChange={event => setValue(event.target.value)}
            onDrag={event => event.stopPropagation()}
        />
    );
}
