import React from 'react';
import useControlState from '../../../hooks/useControlState';


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
            <span className="input-title my-0" style={{verticalAlign: 'top'}}>{control.name}</span>
        </label>
    );
}
