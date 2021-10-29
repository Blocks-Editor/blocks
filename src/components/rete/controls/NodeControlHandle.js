import React, {useContext, useState} from 'react';
import useControlState from '../../../hooks/useControlState';
import EventsContext, {EDITOR_CHANGE_EVENT} from '../../../contexts/EventsContext';
import useListener from '../../../hooks/useListener';
import getNodeLabel from '../../../utils/getNodeLabel';
import classNames from 'classnames';
import {BLOCK_MAP} from '../../../editor/blocks';


export default function NodeControlHandle({editor, control, bindInput}) {
    let [value, setValue] = useControlState(control);

    let [nodes, setNodes] = useState(() => [...editor.nodes]);

    let events = useContext(EventsContext);
    useListener(events, EDITOR_CHANGE_EVENT, () => setNodes([...editor.nodes]));

    let blockName = control.config.type?.meta.block;///
    let blockFilter = blockName && (Array.isArray(blockName) ? blockName : [blockName]).map(block => {
        let name = typeof block === 'string' ? block : block.name;
        if(!BLOCK_MAP.has(name)) {
            throw new Error(`Block not found: ${name}`);
        }
        return name;
    });

    if(blockFilter) {
        nodes = nodes.filter(n => !blockFilter || blockFilter.includes(n.name));
    }

    let invalid = !value || !nodes.some(n => String(n.id) === String(value) && (!blockFilter || blockFilter.includes(n.name)));

    // TODO: cleanly prevent number -> string id conversion
    return (
        <select
            ref={bindInput}
            className={classNames(invalid && 'invalid')}
            style={{maxWidth: '100%'}}
            value={value}
            onChange={event => setValue(event.target.value || undefined)}>
            <option key={-1} label={'(Select a Node)'} value={undefined}/>
            {nodes.map(node => (
                <option key={node.id} label={getNodeLabel(node, editor)} value={node.id}/>
            ))}
        </select>
    );
}
