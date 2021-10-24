import React, {useContext, useState} from 'react';
import useControlState from '../../../hooks/useControlState';
import EventsContext, {EDITOR_CHANGE_EVENT} from '../../../contexts/EventsContext';
import useListener from '../../../hooks/useListener';
import getNodeTitle from '../../../utils/getNodeTitle';


export default function NodeControlHandle({editor, control, bindInput, component}) {
    let [value, setValue] = useControlState(control);

    let [nodes, setNodes] = useState(editor.nodes);

    let events = useContext(EventsContext);
    useListener(events, EDITOR_CHANGE_EVENT, () => setNodes([...editor.nodes]));

    let componentFilter = component && (Array.isArray(component) ? component : [component]).map(name => {
        // if(!editor.components.has(name)) {
        //     throw new Error(`Component not found: ${name}`);
        // }
        return name;
    });

    if(componentFilter) {
        nodes = nodes.filter(n => !componentFilter || componentFilter.some(name => n.name === name));
    }

    return (
        <select
            // className="w-100"
            ref={bindInput}
            value={value}
            onChange={event => setValue(event.target.value || undefined)}>
            <option key={-1} label={'(Select a Node)'} value={undefined}/>
            {nodes.map(node => (
                <option key={node.id} label={getNodeTitle(node, editor)} value={node.id}/>
            ))}
        </select>
    );
}
