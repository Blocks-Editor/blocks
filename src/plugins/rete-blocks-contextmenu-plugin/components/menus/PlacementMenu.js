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
    if(inputType?.data.reversed || outputType?.data.reversed) {
        [inputType, outputType] = [outputType, inputType];
    }
    return components.filter(c =>
        (!inputType || c.block.outputs.some((prop) =>
            !prop.hidden && !prop.advanced/*****/ && (inputType.isSubtype(prop.type) || (prop.inferType && prop.type.isSubtype(inputType))))) &&
        (!outputType || c.block.inputs.some((prop) =>
            !prop.hidden && !prop.advanced/*****/ && ((prop.inferType && outputType.isSubtype(prop.type)) || prop.type.isSubtype(outputType)))));
}

export default function PlacementMenu() {
    let [searchText, setSearchText] = useState('');
    let [index, setIndex] = useState(0);

    const menu = useContext(MenuContext);
    const {editor, mouse, context} = menu;

    let components = useEditorComponents(editor, c => [-(c.block?.category.data.priority || 0), c.block?.category.root.name || '', c.data.title || c.name]);
    if(context) {
        components = findRelevantComponents(context.input, context.output, components);
    }
    else {
        components = components.filter(c => c.block.global);
        searchText = '';
    }

    const options = [];
    // Add custom search results from relevant components
    components.forEach(component => {
        try {
            const block = component.block;
            if(searchText && block.customSearch) {
                const custom = block.customSearch(searchText, menu);
                if(custom) {
                    (Array.isArray(custom) ? custom : [custom]).forEach(option => {
                        option.component = component;
                        options.push(option);
                    });
                }
            }
        }
        catch(e) {
            console.warn(`Error while adding custom search result for ${component.name}`);
            console.warn(e);
        }
    });
    options.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    // Filter components by search text
    if(searchText) {
        const lower = searchText.toLowerCase();
        components = components.filter(c => c.keywords?.some(k => k.toLowerCase().startsWith(lower)) || c.name.toLowerCase().startsWith(lower));
    }
    options.push(...components.map(component => ({component})));

    index = Math.min(options.length - 1, index);

    // Arrow keys pressed
    const handleSearchKeyDown = (event) => {
        if(event.keyCode === 38 /* Up Arrow */) {
            setIndex(Math.max(0, index - 1));
        }
        if(event.keyCode === 40 /* Down Arrow */) {
            setIndex(index + 1);
        }
    };

    // Enter key pressed
    const handleSearchAction = async () => {
        if(options.length) {
            await handleCreateOption(options[index]);
        }
    };

    // Create node from component
    const handleCreateOption = useCallback(async ({component, data, meta}) => {
        setSearchText('');
        editor.trigger('hidecontextmenu');

        const position = context?.input ? {
            x: mouse.x - 180, // TODO: compute width of module
            y: mouse.y,
        } : mouse;

        const node = await createNode(component, {data, meta, position});
        editor.addNode(node);

        if(context) {
            try {
                const {input, output} = context;
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
            catch(err) {
                console.error('Unable to connect relevant input/output');
                console.error(err);
            }
        }
    }, [editor, mouse, context]);

    const menuItems = options.map((option, i) => (
        <MenuComponent
            key={`${option.title}${option.component.name}${i}`}
            component={option.component}
            specialTitle={option.title}
            selected={index === i}
            onAction={() => handleCreateOption(option)}
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
    ) : (
        <>
            {/* Experimental global placement header */}
            <div className="noselect p-2 text-light" style={{opacity: .5, background: '#FFF2'}}>Place anywhere:</div>
            {menuItems}
        </>
    );
}