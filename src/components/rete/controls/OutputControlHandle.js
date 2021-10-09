import React from 'react';
import useControlState from '../../../hooks/useControlState';
import getDefaultLabel from '../../../utils/getDefaultLabel';


export default function OutputControlHandle(props) {
    let [value] = useControlState(props);
    let {control} = props;

    return (value || null) && (
        <input
            type="text"
            className="w-100"
            readOnly
            value={value || ''}
            onDrag={event => event.stopPropagation()}
        />
    );
}
