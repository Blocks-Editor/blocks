import React from 'react';
import useControlState from '../../../hooks/useControlState';


export default function SelectControlHandle({control, bindInput, options, findLabel}) {
    let [value, setValue] = useControlState(control);

    if(!options.includes(value)) {
        value = options[0];
        setValue(value);
    }

    return (
        <select
            // className="w-100"
            ref={bindInput}
            value={value}
            onChange={event => setValue(event.target.value)}>
            {options.map((option, i) => (
                <option key={i} label={findLabel?.(option, i) ?? option} value={option}/>
            ))}
        </select>
    );
}
