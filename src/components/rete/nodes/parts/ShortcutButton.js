import React, {useContext} from 'react';
import {bindNodeInput} from '../../../../utils/bindNodeInput';
import getBlockLabel from '../../../../utils/getBlockLabel';
import EventsContext, {ERROR_EVENT} from '../../../../contexts/EventsContext';
import useReactTooltip from '../../../../hooks/useReactTooltip';

export default function ShortcutButton({editor, node, shortcut}) {
    const {block} = shortcut;
    const {category} = block;

    const events = useContext(EventsContext);

    const onClick = async event => {
        try {
            let component = editor.components.get(block.name);
            if(!component) {
                events.emit(ERROR_EVENT, `Component not found: ${block.name}`);
                return;
            }
            let data = {};
            if(node && shortcut.nodeKey) {
                data[shortcut.nodeKey] = node.id;
            }
            let newNode = await editor.createNodeAtCursor(component, data);

            // Start dragging node
            let nodeView = editor.view.nodes.get(newNode);
            nodeView._drag.down(event);

            // Add shortcut-defined connections
            if(shortcut.connections) {
                for(let connection of shortcut.connections) {
                    let {from, to, fromOutput} = connection;

                    let fromIO = fromOutput ? node.outputs.get(from) : node.inputs.get(from);
                    let toIO = (fromOutput ? newNode.inputs.get(to) : newNode.outputs.get(to));
                    let [output, input] = fromOutput ? [fromIO, toIO] : [toIO, fromIO];
                    if(output && input) {
                        editor.connect(output, input);
                    }
                    else {
                        console.warn('Could not connect', output, 'to', input);
                    }
                }
            }
        }
        catch(err) {
            events.emit(ERROR_EVENT, err);
        }
    };

    useReactTooltip([block]);

    return (
        <div
            ref={bindNodeInput}
            className="btn node-shortcut-button px-1 pt-0 pb-1"
            data-tip={getBlockLabel(block)}
            data-delay-show={100}
            style={{
                // background: 'none',
                color: category.data.color,
                borderColor: category.data.color,
                cursor: 'grab',
                // fontSize: '1em',
            }}
            onMouseDown={onClick}>
            {block.icon
                ? React.createElement(block.icon)
                : getBlockLabel(block)}
        </div>
    );
}