import React, {useCallback, useContext, useState} from 'react';
import MenuNode from '../MenuNode';
import {MenuContext} from '../../contexts/MenuContext';
import MenuSearch from '../MenuSearch';
import useEditorComponents from '../../hooks/useEditorComponents';

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

async function createNode(component, {data = {}, meta = {}, x = 0, y = 0}) {
    const node = await component.createNode(deepCopy(data));
    node.meta = Object.assign(deepCopy(meta), node.meta);
    [node.position[0], node.position[1]] = [x, y];
    return node;
}

export default function PlacementMenu() {
    const [searchText, setSearchText] = useState('');
    let [index, setIndex] = useState(0);

    let {editor, mouse, context} = useContext(MenuContext);

    if(context) {
        console.log('Context:', context);//
    }

    let components = useEditorComponents(editor, c => c.data.title || c.name);
    index = Math.min(components.length - 1, index);

    if(searchText) {
        let lower = searchText.toLowerCase();
        components = components.filter(c => c.keywords?.some(k => k.startsWith(lower)) || c.name.toLowerCase().startsWith(lower));
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
        setSearchText('');
        if(components.length) {
            await handleCreateNode(components[index]);
        }
    }

    // Create node from component
    const handleCreateNode = useCallback(async (component) => {
        editor.trigger('hidecontextmenu');

        const node = await createNode(component, {...mouse});
        editor.addNode(node);

        if(context?.output) {
            const input = [...node.inputs.values()].find(input => input.socket.compatibleWith(context.socket));
            if(input) {
                editor.connect(context.output, input);
            }
        }
        else if(context?.input) {
            const output = [...node.outputs.values()].find(output => context.socket.compatibleWith(output.socket));
            if(output) {
                editor.connect(output, context.input);
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