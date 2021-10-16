import React from 'react';
import useControlState from '../../../hooks/useControlState';
import getDefaultLabel from '../../../utils/getDefaultLabel';


export default function CheckboxControlHandle(props) {
    let [value, setValue] = useControlState(props);
    let {bindInput, control} = props;

    return (
        <label>
            <input
                type="checkbox"
                ref={bindInput}
                checked={!!value}
                onChange={event => setValue(event.target.checked)}
            />
            <span className="input-title my-0" style={{verticalAlign: 'top'}}>{getDefaultLabel(control.key)}</span>
        </label>
    );
}
