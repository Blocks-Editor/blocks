import React from 'react';
import useControlValue from '../../../hooks/useControlValue';
import TypeSelect from '../../common/inputs/TypeSelect';
import {typeType} from '../../../block-types/types';


export default function TypeControlHandle({abstract, control, bindInput}) {
    let [value, setValue] = useControlValue(control);

    let constraintType = control.config.type;
    if(typeType.isSubtype(constraintType)) {
        constraintType = constraintType.generics[0];
    }

    let invalid = !control.validate(value);

    // if(typeType.isSubtype(value)) {
    //     value = value?.generics[0];
    // }

    return (
        <div ref={bindInput}>
            <TypeSelect
                value={value}
                constraintType={constraintType}
                abstract={abstract}
                invalid={invalid}
                onChange={setValue/*type => setValue(typeType.of(type))*/}>
            </TypeSelect>
        </div>
    );
}
