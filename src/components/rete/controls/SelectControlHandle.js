import React from 'react';
import useControlState from '../../../hooks/useControlState';


export default function SelectControlHandle(props) {
    let [value, setValue] = useControlState(props);
    let {bindInput, options, findLabel} = props;

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
