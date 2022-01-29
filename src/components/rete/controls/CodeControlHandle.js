import React from 'react';
import useControlValue from '../../../hooks/useControlValue';
import CodeEditor from '../../monaco/CodeEditor';


export default function CodeControlHandle({control, height, options, bindInput}) {
    let [value, setValue] = useControlValue(control);

    return (
        <div ref={bindInput} style={{height: height || 150}}>
            <CodeEditor value={value} options={options} onChange={setValue}/>
        </div>
    );
}
