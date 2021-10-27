import {anyType, getType, TYPE_MAP} from '../../block-types/types';
import React, {useContext} from 'react';
import EventsContext, {ERROR_EVENT} from '../../contexts/EventsContext';

export default function TypeSelect({value, constraintType, abstract, onChange, ...others}) {

    constraintType = constraintType || anyType;

    const types = [...TYPE_MAP.values()]
        .filter(type => (abstract || !type.isAbstract()) && constraintType.isSubtype(type));

    let events = useContext(EventsContext);

    if(value) {
        try {
            value = getType(value);
        }
        catch(err) {
            // console.error(err);
            events.emit(ERROR_EVENT, err);
        }
    }
    else if(types.length) {
        onChange(value = types[0]);
        // value = constraintType;
    }

    return (
        <>
            <select
                // className="w-100"
                value={value?.name}
                onChange={event => onChange(getType(event.target.value))}
                {...others}>
                {types.map(type => (
                    <option key={type.name} label={type.name} value={type.name}/>
                ))}
            </select>
            {value?.generics.map((type, i) => (
                <TypeSelect
                    key={i}
                    value={type}
                    onChange={t => onChange(getType({
                        ...value.toJSON(),
                        generics: [...value.generics].splice(i, 1, t),
                    }))}/>
            ))}
        </>
    );
}