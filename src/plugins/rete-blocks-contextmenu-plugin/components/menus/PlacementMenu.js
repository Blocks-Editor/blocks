import React, {useCallback, useContext, useState} from 'react';
import MenuNode from '../MenuNode';
import {MenuContext} from '../../contexts/MenuContext';
import MenuSearch from '../MenuSearch';
import useEditorComponents from '../../hooks/useEditorComponents';
import Rete from 'rete';

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

async function createNode(component, {data = {}, meta = {}, x = 0, y = 0}) {
    const node = await component.createNode(deepCopy(data));
    node.meta = Object.assign(deepCopy(meta), node.meta);
    [node.position[0], node.position[1]] = [x, y];
    return node;
}

function findRelevantComponents(io, components) {
    let propKey = io instanceof Rete.Input ? 'input' : io instanceof Rete.Output ? 'output' : null;
    let socketType = io.socket.findType?.();
    if(!propKey || !socketType) {
        return [];
    }
    // Find compatible inputs/outputs
    return components.filter(c =>
        Object.values(c.block?.props)
            .some(prop => prop[propKey] && (socketType.isSubtype(prop.type) || prop.type.isSubtype(socketType))));
}

export default function PlacementMenu() {
    const [searchText, setSearchText] = useState('');
    let [index, setIndex] = useState(0);

    let {editor, mouse, context} = useContext(MenuContext);

    if(context) {
        console.log('Context:', context);//
    }

    let components = useEditorComponents(editor, c => c.data.title || c.name);
    if(context?.io) {
        components = findRelevantComponents(context.io, components);
    }
    index = Math.min(components.length - 1, index);

    if(searchText) {
        let lower = searchText.toLowerCase();
        components = components.filter(c => c.keywords?.some(k => k.toLowerCase().startsWith(lower)) || c.name.toLowerCase().startsWith(lower));
    }

    // Arrow keys pressed
    function handleSearchKeyDown(event) {
        if(event.keyCode === 38 /* Up Arrow */) {
            setIndex(Math.max(0, index - 1));
        }
        if(event.keyCode === 40 /* Down Arrow */) {
            setIndex(index + 1);
        }
    }

    // Enter key pressed
    async function handleSearchAction() {
        if(components.length) {
            await handleCreateNode(components[index]);
        }
    }

    // Create node from component
    const handleCreateNode = useCallback(async (component) => {
        setSearchText('');
        editor.trigger('hidecontextmenu');

        const node = await createNode(component, {...mouse});
        editor.addNode(node);

        if(context?.io) {
            const io = context.io;
            if(io instanceof Rete.Input) {
                const output = [...node.outputs.values()].find(output => io.socket.compatibleWith(output.socket));
                if(output) {
                    editor.connect(output, io);
                }
            }
            else if(io instanceof Rete.Output) {
                const input = [...node.inputs.values()].find(input => input.socket.compatibleWith(io.socket));
                if(input) {
                    editor.connect(io, input);
                }
            }
        }
    }, [editor, mouse, context]);

    return (
        <>
            <MenuSearch
                value={searchText}
                onChange={setSearchText}
                onKeyDown={handleSearchKeyDown}
                onAction={handleSearchAction}>
                {components.map((component, i) => (
                    <MenuNode
                        key={component.name}
                        component={component}
                        selected={index === i}
                        onAction={() => handleCreateNode(component)}
                    />
                ))}
            </MenuSearch>
        </>
    );
}