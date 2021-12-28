import React from 'react';
import useControlValue from '../../../hooks/useControlValue';


export default function NumberControlHandle({control, bindInput, validation: {min, max, step}}) {
    let [value, setValue] = useControlValue(control);

    return (
        <input
            type="number"
            style={{width: '4em'}}
            ref={bindInput}
            min={min}
            max={max}
            step={step}
            value={value || 0}
            onChange={event => setValue(+event.target.value || event.target.value)}
        />
    );
}
