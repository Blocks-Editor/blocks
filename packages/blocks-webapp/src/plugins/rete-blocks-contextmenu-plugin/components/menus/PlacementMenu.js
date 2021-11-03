import React, {useCallback, useContext, useState} from 'react';
import MenuComponent from '../MenuComponent';
import {MenuContext} from '../../contexts/MenuContext';
import MenuSearch from '../MenuSearch';
import useEditorComponents from '../../hooks/useEditorComponents';

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export async function createNode(component, {data, meta, position: {x, y} = {}}) {
    const node = await component.createNode(data ? deepCopy(data) : {});
    if(meta) {
        node.meta = Object.assign(deepCopy(meta), node.meta);
    }
    [node.position[0], node.position[1]] = [x, y];
    return node;
}

function findRelevantComponents(input, output, components) {
    if(!input && !output) {
        return components;
    }
    let [inputType, outputType] = [input?.socket.findType?.(), output?.socket.findType?.()];
    // if(!inputType && !outputType) {
    //     return [];
    // }
    if(inputType?.data.reversed || outputType?.data.reversed) {
        [inputType, outputType] = [outputType, inputType];
    }
    return components.filter(c =>
        (!inputType || c.block.outputs.some((prop) => inputType.isSubtype(prop.type) || prop.type.isSubtype(inputType))) &&
        (!outputType || c.block.inputs.some((prop) => outputType.isSubtype(prop.type) || prop.type.isSubtype(outputType))));
}

export default function PlacementMenu() {
    let [searchText, setSearchText] = useState('');
    let [index, setIndex] = useState(0);

    let {editor, mouse, context} = useContext(MenuContext);

    let components = useEditorComponents(editor, c => [c.block?.category.root.name, c.data.title || c.name]);
    if(context) {
        components = findRelevantComponents(context.input, context.output, components);
    }
    else {
        components = components.filter(c => c.block.global);
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

        const node = await createNode(component, {position: mouse});
        editor.addNode(node);

        if(context) {
            let {input, output} = context;
            if(input) {
                const output = [...node.outputs.values()].find(output => input.socket.compatibleWith(output.socket));
                if(output) {
                    editor.connect(output, input);
                }
            }
            if(output) {
                const input = [...node.inputs.values()].find(input => input.socket.compatibleWith(output.socket));
                if(input) {
                    editor.connect(output, input);
                }
            }
        }
    }, [editor, mouse, context]);

    // TODO: create literal blocks when typing numbers, strings, etc.
    let menuItems = components.map((component, i) => (
        <MenuComponent
            key={component.name}
            component={component}
            selected={index === i}
            onAction={() => handleCreateNode(component)}
        />
    ));
    return context ? (
        <MenuSearch
            value={searchText}
            onChange={setSearchText}
            onKeyDown={handleSearchKeyDown}
            onAction={handleSearchAction}>
            {menuItems}
        </MenuSearch>
    ) : menuItems;
}