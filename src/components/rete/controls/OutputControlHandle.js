import React from 'react';
import useControlState from '../../../hooks/useControlState';


export default function OutputControlHandle(props) {
    let [value] = useControlState(props);
    let {bindInput} = props;

    return (value || null) && (
        <input
            type="text"
            className="w-100"
            readOnly
            ref={bindInput}
            value={value || ''}
        />
    );
}
