import React from 'react';
import useControlState from '../../../hooks/useControlState';


export default function NumberControlHandle(props) {
    let [value, setValue] = useControlState(props);
    let {min, max, step} = props;

    return (
        <input
            type="number"
            style={{width: '4em'}}
            min={min}
            max={max}
            step={step}
            value={value || 0}
            onChange={event => setValue(event.target.value)}
            onDrag={event => event.stopPropagation()}
        />
    );
}
