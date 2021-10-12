import React from 'react';
import useControlState from '../../../hooks/useControlState';


export default function NumberControlHandle(props) {
    let [value, setValue] = useControlState(props);
    let {bindInput, min, max, step} = props;

    return (
        <input
            type="number"
            style={{width: '4em'}}
            ref={bindInput}
            min={min}
            max={max}
            step={step}
            value={value || 0}
            onChange={event => setValue(event.target.value)}
        />
    );
}
