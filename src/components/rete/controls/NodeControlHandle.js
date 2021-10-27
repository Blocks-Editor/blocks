import React, {useContext, useState} from 'react';
import useControlState from '../../../hooks/useControlState';
import EventsContext, {EDITOR_CHANGE_EVENT} from '../../../contexts/EventsContext';
import useListener from '../../../hooks/useListener';
import getNodeLabel from '../../../utils/getNodeLabel';
import classNames from 'classnames';


export default function NodeControlHandle({editor, control, bindInput, component}) {
    let [value, setValue] = useControlState(control);

    let [nodes, setNodes] = useState(() => [...editor.nodes]);

    let events = useContext(EventsContext);
    useListener(events, EDITOR_CHANGE_EVENT, () => setNodes([...editor.nodes]));

    let componentFilter = component && (Array.isArray(component) ? component : [component]).map(name => {
        // if(!editor.components.has(name)) {
        //     throw new Error(`Component not found: ${name}`);
        // }
        return name;
    });

    if(componentFilter) {
        nodes = nodes.filter(n => !componentFilter || componentFilter.includes(n.name));
    }

    let invalid = !value || !nodes.some(n => String(n.id) === String(value) && (!componentFilter || componentFilter.includes(n.name)));

    // TODO: cleanly prevent number -> string id conversion
    return (
        <select
            className={classNames(invalid && 'invalid')}
            ref={bindInput}
            value={value}
            onChange={event => setValue(event.target.value || undefined)}>
            <option key={-1} label={'(Select a Node)'} value={undefined}/>
            {nodes.map(node => (
                <option key={node.id} label={getNodeLabel(node, editor)} value={node.id}/>
            ))}
        </select>
    );
}
