import React from 'react';
import useControlState from '../../../hooks/useControlState';
import TypeSelect from '../../common/inputs/TypeSelect';


export default function TypeControlHandle({control, bindInput}) {
    let [value, setValue] = useControlState(control);

    let constraintType = control.config.type.generics[0];

    let invalid = !control.validate(value);

    return (
        <div ref={bindInput}>
            <TypeSelect
                value={value}
                constraintType={constraintType}
                invalid={invalid}
                onChange={setValue}>
            </TypeSelect>
        </div>
    );
}
