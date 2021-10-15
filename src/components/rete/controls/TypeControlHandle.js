import React from 'react';
import useControlState from '../../../hooks/useControlState';
import TypeSelect from '../../inputs/TypeSelect';


export default function TypeControlHandle(props) {
    let [value, setValue] = useControlState(props);
    let {control, bindInput} = props;

    let constraintType = control.config.type.generics[0];

    return (
        <>
            <TypeSelect
                forwardedRef={bindInput}
                value={value?.name}
                constraintType={constraintType}
                onChange={setValue}>
            </TypeSelect>
        </>
    );
}
