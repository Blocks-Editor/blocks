import React from 'react';
import useControlState from '../../../hooks/useControlState';


export default function NodeControlHandle({editor, control, bindInput, component}) {
    let [value, setValue] = useControlState(control);

    let componentFilter = component && (Array.isArray(component) ? component : [component]).map(name => {
        if(!editor.components.has(name)) {
            throw new Error(`Component not found: ${name}`);
        }
        return name;
    });

    let nodes = editor.nodes;
    if(componentFilter) {
        nodes = nodes.filter(n => !componentFilter || componentFilter.some(name => n.name === name));
    }

    console.log(nodes);////

    return (
        <select
            // className="w-100"
            ref={bindInput}
            value={value}
            onChange={event => setValue(event.target.value || undefined)}>
            <option key={-1} label={'--'} value={undefined}/>
            {nodes.map(node => (
                <option key={node.id} label={node.name + ' / ' + node.id} value={node.id}/>
            ))}
        </select>
    );
}
