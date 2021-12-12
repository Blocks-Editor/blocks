import React from 'react';
import useControlValue from '../../../hooks/utils/useControlValue';


export default function CheckboxControlHandle({control, bindInput}) {
    let [value, setValue] = useControlValue(control);

    return (
        <label ref={bindInput}>
            <input
                type="checkbox"
                checked={!!value}
                onChange={event => setValue(event.target.checked)}
            />
            <span className="input-title my-0" style={{verticalAlign: 'top'}}>{control.name}</span>
        </label>
    );
}
