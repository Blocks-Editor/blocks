import React from 'react';
import useControlState from '../../../hooks/useControlState';
import getDefaultLabel from '../../../utils/getDefaultLabel';


export default function TextControlHandle(props) {
    let [value, setValue] = useControlState(props);
    let {bindInput, control, minLength, maxLength} = props;

    return (
        <input
            type="text"
            className="w-100"
            autoComplete="blocks-app"
            autoCorrect="off"
            // autoCapitalize="off"
            ref={bindInput}
            value={value || ''}
            placeholder={getDefaultLabel(control.key)}
            minLength={minLength}
            maxLength={maxLength}
            onChange={event => setValue(event.target.value)}
        />
    );
}
