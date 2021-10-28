import React, {useContext, useEffect} from 'react';
import {bindNodeInput} from '../../../../utils/bindNodeInput';
import getBlockLabel from '../../../../utils/getBlockLabel';
import {Button} from 'react-bootstrap';
import EventsContext, {ERROR_EVENT} from '../../../../contexts/EventsContext';
import ReactTooltip from 'react-tooltip';

export default function ShortcutButton({editor, node, shortcut}) {
    let {block} = shortcut;
    let {category} = block;

    let events = useContext(EventsContext);

    let onClick = async event => {
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
            let newNode = await component.createNode(data);
            let {x, y} = editor.view.area.mouse;
            [newNode.position[0], newNode.position[1]] = [x - 80, y - 20];
            editor.addNode(newNode);

            // Start dragging node
            let nodeView = editor.view.nodes.get(newNode);
            nodeView._drag.down(event);
        }
        catch(err) {
            events.emit(ERROR_EVENT, err);
        }
    };

    // TODO: optimize?
    useEffect(() => {
        setTimeout(() => ReactTooltip.rebuild());
    }, [block]);

    return (
        <Button
            ref={bindNodeInput}
            className="node-shortcut-button px-1 pt-0 pb-1"
            data-tip={getBlockLabel(block)}
            data-delay-show={100}
            style={{
                background: 'none',
                color: category.data.color,
                borderColor: category.data.color,
                cursor: 'grab',
                // fontSize: '1em',
            }}
            onMouseDown={onClick}>
            {block.icon
                ? React.createElement(block.icon)
                : getBlockLabel(block)}
        </Button>
    );
}