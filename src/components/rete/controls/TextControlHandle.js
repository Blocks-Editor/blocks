import React from 'react';
import useControlState from '../../../hooks/useControlState';


export default function TextControlHandle({control, bindInput, minLength, maxLength}) {
    let [value, setValue] = useControlState(control);

    return (
        <input
            type="text"
            className="w-100"
            autoComplete="blocks-app"
            autoCorrect="off"
            ref={bindInput}
            value={value || ''}
            placeholder={control.name}
            minLength={minLength}
            maxLength={maxLength}
            onChange={event => setValue(event.target.value)}
        />
    );
}
