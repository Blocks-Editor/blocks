import React from 'react';
import useControlState from '../../../hooks/useControlState';
import getDefaultLabel from '../../../utils/getDefaultLabel';


export default function TextControlHandle(props) {
    let [value, setValue] = useControlState(props);
    let {bindInput, control, maxLength} = props;

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
            maxLength={maxLength}
            onChange={event => setValue(event.target.value)}
            onDrag={event => event.stopPropagation()}
        />
    );
}
