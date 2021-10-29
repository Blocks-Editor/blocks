import {anyType, getType, TYPE_MAP} from '../../block-types/types';
import React, {useContext} from 'react';
import EventsContext, {ERROR_EVENT} from '../../contexts/EventsContext';
import classNames from 'classnames';
import useReactTooltip from '../../hooks/useReactTooltip';

export default function TypeSelect({value, constraintType, abstract, onChange, ...others}) {

    constraintType = constraintType || anyType;

    const types = [...TYPE_MAP.values()]
        .filter(type => (abstract || !type.data.abstract) && constraintType.isSubtype(type));

    let events = useContext(EventsContext);

    if(value) {
        try {
            value = getType(value);
        }
        catch(err) {
            onChange(value = undefined);///
            // console.error(err);
            events.emit(ERROR_EVENT, err);
        }
    }

    let isUnknown = !value || !types.some(t => t.isSubtype(value));

    // if(isUnknown && types.length) {
    //     let firstType = types[0];
    //     if(firstType) {
    //         onChange(value = firstType);
    //     }
    //     // value = constraintType;
    // }

    useReactTooltip();

    return (
        <>
            <select
                className={classNames(isUnknown && 'invalid')}
                value={value?.name}
                onChange={event => onChange(getType(event.target.value))}
                {...others}>
                {isUnknown && <option label="(Type)" value={value?.name}/>}
                {types.map(type => (
                    <option key={type.name} label={type.name} value={type.name}/>
                ))}
            </select>
            <div className="ps-2">
                {value?.generics?.map((type, i) => (
                    <TypeSelect
                        key={i}
                        value={type}
                        constraintType={value.data.baseType.generics[i]}
                        data-tip={value.data.genericNames?.[i]}
                        onChange={t => {
                            let generics = [...value.generics];
                            generics.splice(i, 1, t);
                            onChange(getType({
                                ...value.toJSON(),
                                generics,
                            }));
                        }}/>
                ))}
            </div>
        </>
    );
}