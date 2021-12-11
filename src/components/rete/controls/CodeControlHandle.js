import React from 'react';
import useControlValue from '../../../hooks/useControlValue';
import CodeEditor from '../../monaco/CodeEditor';


export default function CodeControlHandle({control, bindInput}) {
    let [value, setValue] = useControlValue(control);

    return (
        <div ref={bindInput} style={{height: 150}}>
            <CodeEditor value={value} onChange={setValue}/>
        </div>
    );
}
