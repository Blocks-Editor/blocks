import React, {useMemo} from 'react';
import useControlState from '../../../hooks/useControlState';
import {getType, TYPE_MAP} from '../../../block-types/types';


export default function TypeControlHandle(props) {
    let [value, setValue] = useControlState(props);
    let {control, bindInput} = props;

    let subtype = control.config.type.generics[0];

    try {
        console.log(value);
        value = getType(value);
    }
    catch(err) {
        console.error(err.stack || err);
        value = subtype;
    }

    console.log('Control type:', control.config.type.toTypeString());////

    const types = [...TYPE_MAP.values()]
        .filter(type => subtype.isSubtype(type));

    // TODO: dropdowns for generic parameters

    return (
        <select
            className="w-100"
            ref={bindInput}
            value={value?.name}
            onChange={event => setValue(getType(event.target.value))}>
            {types.map(type => (
                <option key={type.name} label={type.name} value={type.name}/>
            ))}
        </select>
    );
}
