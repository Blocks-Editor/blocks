import {anyType, getType, TYPE_MAP} from '../../../block-types/types';
import React, {useContext} from 'react';
import EventsContext, {ERROR_EVENT} from '../../../contexts/EventsContext';
import classNames from 'classnames';
import useReactTooltip from '../../../hooks/useReactTooltip';
import getDefaultLabel from '../../../utils/getDefaultLabel';
import {Button, ButtonGroup} from 'react-bootstrap';
import {onLeftClick} from '../../../utils/eventHelpers';
import {FaMinus, FaPlus} from 'react-icons/fa';

const withGenerics = (type, generics) => {
    return getType({
        ...type.toJSON(),
        generics,
    });
};

export default function TypeSelect({value, constraintType, abstract, invalid, onChange, ...others}) {

    constraintType = constraintType || anyType;

    const types = [...TYPE_MAP.values()]
        .filter(type => (abstract || !type.data.abstract || type.data.arbitraryGenericType) && constraintType.isSubtype(type));

    const events = useContext(EventsContext);

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

    invalid = invalid || !value || !types.some(t => t.isSubtype(value));

    // if(invalid && types.length) {
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
                className={classNames(invalid && 'invalid')}
                value={value?.name}
                onChange={event => {
                    const type = getType({name: event.target.value});
                    console.log(type)
                    onChange(type.data.arbitraryGenericType ? withGenerics(type, [type.data.arbitraryGenericType]) : type);
                }}
                {...others}>
                {invalid && <option label="(Type)" value={value?.name}/>}
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
                            constraintType={value.data.baseType.generics[i]}
                            abstract={abstract}
                            data-tip={getDefaultLabel(value.data.genericNames?.[i])}
                            onChange={t => {
                                const generics = [...value.generics];
                                generics.splice(i, 1, t);
                                onChange(withGenerics(value, generics));
                            }}/>
                    ))}
                    {/* Arbitrary number of generic values (e.g. tuples, records) */}
                    {!!value.data.arbitraryGenericType && (
                        <ButtonGroup size="sm">
                            <Button {...onLeftClick(() => onChange(withGenerics(value, [...value.generics, null])))}>
                                <FaPlus/>
                            </Button>
                            <Button {...onLeftClick(() => onChange(withGenerics(value, value.generics.slice(0, -1))))}>
                                <FaMinus/>
                            </Button>
                        </ButtonGroup>
                    )}
                </div>
            )}
        </>
    );
}