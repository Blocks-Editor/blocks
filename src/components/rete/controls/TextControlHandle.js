import React from 'react';
import useControlState from '../../../hooks/useControlState';


export default function TextControlHandle(props) {
    let [value, setValue] = useControlState(props);
    let {maxLength} = props;

    return (
        <input
            type="text"
            value={value || ''}
            maxLength={maxLength}
            onChange={event => setValue(event.target.value)}
            onDrag={event => event.stopPropagation()}
        />
    );
}
