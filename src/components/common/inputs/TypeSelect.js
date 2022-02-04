import {anyType, customType, getType, TYPE_MAP} from '../../../block-types/types';
import React, {useContext} from 'react';
import EventsContext, {ERROR_EVENT} from '../../../contexts/EventsContext';
import classNames from 'classnames';
import useReactTooltip from '../../../hooks/useReactTooltip';
import getDefaultLabel from '../../../utils/getDefaultLabel';
import {onLeftClick} from '../../../utils/eventHelpers';
import {FaMinus, FaPlus} from 'react-icons/fa';

const withGenerics = (type, generics) => {
    return type.data.baseType.of(...generics);
};

export default function TypeSelect({value, constraintType, abstract, invalid, onChange, ...others}) {

    constraintType = constraintType || anyType;

    const types = [...TYPE_MAP.values()]
        .filter(type => !type.data.hidden && (abstract || !type.data.abstract || type.data.arbitraryGenericType) && constraintType.isSubtype(type));

    const events = useContext(EventsContext);

    if(value) {
        try {
            value = getType(value);
        }
        catch(err) {
            onChange(value = constraintType);///
            events.emit(ERROR_EVENT, err);
        }
    }

    invalid = invalid || !value || !types.some(t => t.isSubtype(value));

    // if(invalid && types.length) {
    //     let firstType = types[0];
    //     if(firstType) {
    //         onChange(value = firstType);
    //     }
    //     // value = constraintType;
    // }

    const arbitraryGenericType = value?.data.baseType.data.arbitraryGenericType;

    useReactTooltip();

    return (
        <>
            <select
                className={classNames(invalid && 'invalid')}
                value={value?.name}
                onChange={event => {
                    const type = getType({name: event.target.value});
                    onChange(type);
                    // onChange(type.data.arbitraryGenericType ? type.of(type.data.arbitraryGenericType) /*withGenerics(type, [type.data.arbitraryGenericType])*/ : type);
                }}
                {...others}>
                {(invalid || !value || !types.some(t => t.name === value.name && t.isSubtype(value))) && (
                    <option label="(Type)" value={value?.name}/>
                )}
                {types.map(type => (
                    <option key={type.name} label={type.name} value={type.name}/>
                ))}
            </select>
            {value && (
                <div className="ps-2">
                    {value.generics?.map((type, i) => (
                        <TypeSelect
                            key={i}
                            value={type}
                            constraintType={value.data.baseType.generics[i] || arbitraryGenericType}
                            abstract={abstract}
                            data-tip={getDefaultLabel(value.data.genericNames?.[i])}
                            onChange={t => {
                                const generics = [...value.generics];
                                generics.splice(i, 1, t);
                                onChange(withGenerics(value, generics));
                            }}/>
                    ))}
                    {value.data.baseType === customType && (
                        // TODO: refactor
                        <input
                            type="text"
                            className={classNames('w-100')}
                            autoComplete="blocks-app"
                            autoCorrect="off"
                            value={value.meta.motoko || ''}
                            placeholder="Motoko expression"
                            onChange={event => onChange(value.withMeta({motoko: event.target.value || undefined}))}
                        />
                    )}
                    {/* Arbitrary number of generic values (e.g. tuples, records) */}
                    {!!arbitraryGenericType && (
                        <div className="btn-group btn-group-sm mb-1">
                            <div
                                className="btn btn-outline-secondary pt-0 pb-1"
                                {...onLeftClick(() => onChange(withGenerics(value, [...value.generics, arbitraryGenericType])))}>
                                <FaPlus/>
                            </div>
                            {!!value.generics.length && (
                                <div
                                    className="btn btn-outline-secondary pt-0 pb-1"
                                    {...onLeftClick(() => onChange(withGenerics(value, value.generics.slice(0, -1))))}>
                                    <FaMinus/>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}