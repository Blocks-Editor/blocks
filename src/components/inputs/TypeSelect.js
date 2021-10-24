import {anyType, getType, TYPE_MAP} from '../../block-types/types';
import React from 'react';

export default function TypeSelect({value, constraintType, abstract, onChange, ...others}) {

    constraintType = constraintType || anyType;

    if(value) {
        try {
            value = getType(value);
        }
        catch(err) {
            console.error(err.stack || err);
        }
    }
    value = value || constraintType;

    const types = [...TYPE_MAP.values()]
        .filter(type => (abstract || !type.isAbstract()) && constraintType.isSubtype(type));

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