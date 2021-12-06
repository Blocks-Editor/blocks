import React from 'react';
import useControlState from '../../../hooks/useControlState';
import CodeEditor from '../../monaco/CodeEditor';


export default function CodeControlHandle({control, bindInput}) {
    let [value, setValue] = useControlState(control);

    return (
        <div ref={bindInput} style={{height: 150}}>
            <CodeEditor value={value} onChange={setValue}/>
        </div>
    );
}
