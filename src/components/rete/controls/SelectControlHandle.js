import React from 'react';
import useControlValue from '../../../hooks/utils/useControlValue';
import classNames from 'classnames';


export default function SelectControlHandle({control, bindInput, options, findLabel}) {
    let [value, setValue] = useControlValue(control);

    if(value === undefined && !options.includes(value)) {
        value = options[0];
        setValue(value);
    }

    let invalid = !control.validate(value) || !options.includes(value);

    return (
        <select
            className={classNames(invalid && 'invalid')}
            ref={bindInput}
            value={value}
            onChange={event => setValue(event.target.value || undefined)}>
            {options.map((option, i) => (
                <option key={i} label={findLabel?.(option, i) ?? option} value={option}/>
            ))}
        </select>
    );
}
