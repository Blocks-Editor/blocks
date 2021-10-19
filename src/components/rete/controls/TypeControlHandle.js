import React from 'react';
import useControlState from '../../../hooks/useControlState';
import TypeSelect from '../../inputs/TypeSelect';


export default function TypeControlHandle({control, bindInput}) {
    let [value, setValue] = useControlState(control);

    let constraintType = control.config.type.generics[0];

    return (
        <div ref={bindInput}>
            <TypeSelect
                value={value?.name}
                constraintType={constraintType}
                onChange={setValue}>
            </TypeSelect>
        </div>
    );
}
