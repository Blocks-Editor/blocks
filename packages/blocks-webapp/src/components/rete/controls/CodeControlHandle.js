import React from 'react';
import useControlState from '../../../hooks/useControlState';
import CodeEditor from '../../monaco/CodeEditor';


export default function CodeControlHandle({control, bindInput}) {
    let [value, setValue] = useControlState(control);

    // let invalid = !control.validate(value);

    // TODO: syntax highlighting

    return (
        // <input
        //     type="textarea"
        //     className={classNames('w-100', invalid && 'invalid')}
        //     autoComplete="blocks-app"
        //     autoCorrect="off"
        //     ref={bindInput}
        //     value={value || ''}
        //     placeholder={control.name}
        //     onChange={event => setValue(event.target.value || '')}
        // />
        <div ref={bindInput} style={{height: 100}}>
            <CodeEditor value={value} onChange={setValue}/>
        </div>

    );
}
