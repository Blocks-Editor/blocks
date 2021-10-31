import React, {useContext, useState} from 'react';
import './Editor.scss';
import AreaPlugin from 'rete-area-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
import ContextMenuPlugin from '../../plugins/rete-blocks-contextmenu-plugin';
import HistoryPlugin from 'rete-history-plugin';
import AutoArrangePlugin from 'rete-auto-arrange-plugin';
import ReactRenderPlugin from 'rete-react-render-plugin';
import EventsContext, {EDITOR_CHANGE_EVENT, EDITOR_SAVE_EVENT, ERROR_EVENT} from '../../contexts/EventsContext';
import NodeHandle from './nodes/NodeHandle';
import BlockComponent from '../../editor/components/BlockComponent';
import {BLOCK_MAP} from '../../editor/blocks';
import useListener from '../../hooks/useListener';
import BlocksNodeEditor from '../../editor/BlocksNodeEditor';
import VerticalSortPlugin from '../../plugins/rete-vertical-sort-plugin';
import ConnectionDropPlugin from '../../plugins/rete-connection-drop-plugin';
import ConnectionOpacityPlugin from '../../plugins/rete-connection-opacity-plugin';
import classNames from 'classnames';
import styled from 'styled-components';
import EditorMenu from './EditorMenu';

const EDITOR_NAME = process.env.REACT_APP_EDITOR_NAME;
const EDITOR_VERSION = process.env.REACT_APP_EDITOR_VERSION;

function findCategory(socket) {
    return socket.findType?.().data.category ?? socket.data.category ?? 'none';
}

// noinspection JSCheckFunctionSignatures
function createEditor(element) {

    let editor = new BlocksNodeEditor(EDITOR_NAME + '@' + EDITOR_VERSION, element);
    editor.use(ReactRenderPlugin, {
        component: NodeHandle,
    });
    editor.use(HistoryPlugin);
    editor.use(ConnectionPlugin);
    // editor.use(CommentPlugin);
    // editor.use(SelectionPlugin, {
    //     enabled: true,
    // });
    // noinspection JSCheckFunctionSignatures
    editor.use(AutoArrangePlugin);
    // noinspection JSCheckFunctionSignatures
    editor.use(AreaPlugin, {
        background: (() => {
            let background = document.createElement('div');
            background.classList.add('grid');
            background.style.pointerEvents = 'none';
            editor.on('destroy', () => background.remove());
            return background;
        })(),
        snap: {size: 16, dynamic: true},
    });
    editor.use(ContextMenuPlugin);
    editor.use(ConnectionDropPlugin);
    editor.use(ConnectionOpacityPlugin);
    editor.use(VerticalSortPlugin);

    let mouseMoved = false;
    editor.view.container.addEventListener('mousedown', (e) => {
        mouseMoved = false;
    });
    editor.on('mousemove', (e) => {
        mouseMoved = true;
    });
    editor.on('click', ({e}) => {
        // Deselect nodes when clicking background
        if(!mouseMoved) {
            editor.selected.clear();
            editor.nodes.map(node => node.update());
        }
    });

    editor.on('zoom', ({source}) => source !== 'dblclick'); // Prevent double-click zoom
    editor.on('nodeselect', node => !editor.selected.contains(node)); // Allow dragging multiple nodes
    editor.on('renderconnection', ({el, connection}) => {
        let inputCategory = findCategory(connection.input.socket);
        let outputCategory = findCategory(connection.output.socket);
        if(connection.input.socket.data.reversed) {
            [inputCategory, outputCategory] = [outputCategory, inputCategory];
        }
        el.querySelector('.connection').classList.add(
            `socket-input-category-${inputCategory}`,
            `socket-output-category-${outputCategory}`,
        );
    });

    return editor;
}


const EditorContainer = styled.div`
  width: 100%;
  height: 100vh;
`;

export default function Editor({onSetup, onChange, onSave, className, ...others}) {

    const events = useContext(EventsContext);

    let editor = null;

    useListener(events, EDITOR_CHANGE_EVENT, (_editor) => {
        if(_editor === editor) {
            onChange?.(editor);
        }
    });
    useListener(events, EDITOR_SAVE_EVENT, (_editor) => {
        if(_editor === editor) {
            onSave?.(editor.toJSON(), editor);
        }
    });

    let bindEditor = (element) => {
        if(editor) {
            editor.clear();
            editor.components.clear();
            editor.destroy();
        }
        if(!element) {
            return;
        }

        editor = createEditor(element);

        window.EDITOR = editor; // Browser debugging

        let onKeyDown = (event) => {
            let key = String.fromCharCode(event.which).toLowerCase();

            // if(key === 'f') {
            //     editor.trigger('arrange');
            // }
            if(event.ctrlKey) {
                if(key === 's') {
                    event.preventDefault();
                    events.emit(EDITOR_SAVE_EVENT, editor);
                    console.log('Saved successfully');
                }
            }
        };
        document.addEventListener('keydown', onKeyDown);
        editor.on('destroy', () => document.removeEventListener('keydown', onKeyDown));

        for(let block of BLOCK_MAP.values()) {
            let node = new BlockComponent(block);
            editor.register(node);
        }

        editor.on(['nodecreated', 'noderemoved', 'nodedragged', 'connectioncreated', 'connectionremoved'], async () => {
            if(!editor.silent) {
                events.emit(EDITOR_CHANGE_EVENT, editor);
            }
        });
        editor.on('error', err => events.emit(ERROR_EVENT, err));

        async function loadState(state) {
            if(!state) {
                return false;
            }
            // for(let [key, node] of Object.entries(state.nodes)) {
            //     if(!BLOCK_MAP.has(node.name)) {
            //         delete state.nodes[key];
            //         console.warn('Unknown block:', node.name);
            //     }
            // }
            let result = await editor.fromJSON(state);
            if(result) {
                editor.view.resize();
                AreaPlugin.zoomAt(editor);
                events.emit(EDITOR_CHANGE_EVENT, editor);
            }
            return result;
        }

        (async () => {
            if(onSetup) {
                await onSetup(loadState, editor);
            }
        })().catch(err => events.emit(ERROR_EVENT, err));
    };

    return (
        <EditorContainer
            className={classNames('node-editor', className)}
            {...others}>
            <EditorMenu getEditor={() => editor}/>
            <div ref={bindEditor}/>
        </EditorContainer>
    );
}