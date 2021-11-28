import React, {useContext} from 'react';
import AreaPlugin from 'rete-area-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
import ContextMenuPlugin from '../../plugins/rete-blocks-contextmenu-plugin';
import AutoArrangePlugin from 'rete-auto-arrange-plugin';
import ReactRenderPlugin from 'rete-react-render-plugin';
import EventsContext, {
    EDITOR_CHANGE_EVENT,
    EDITOR_SAVE_EVENT,
    ERROR_EVENT,
    PROJECT_LOAD_EVENT,
} from '../../contexts/EventsContext';
import NodeHandle from './nodes/NodeHandle';
import BlockComponent from '../../editor/components/BlockComponent';
import {BLOCK_MAP} from '../../editor/blocks';
import useListener from '../../hooks/useListener';
import BlocksNodeEditor from '../../editor/BlocksNodeEditor';
import VerticalSortPlugin from '../../plugins/rete-vertical-sort-plugin';
import ConnectionDropPlugin from '../../plugins/rete-connection-drop-plugin';
import ConnectionOpacityPlugin from '../../plugins/rete-connection-opacity-plugin';
import DragButtonPlugin from '../../plugins/rete-drag-button-plugin';
import classNames from 'classnames';
import styled from 'styled-components';
import EditorMenu from './EditorMenu';
import FileDropZone from '../common/FileDropZone';
import {SHORTCUT_KEYS} from '../../editor/shortcutKeys';
import ConnectionAwareListContext from '../../contexts/ConnectionAwareListContext';
import useThemeState from '../../hooks/settings/useThemeState';

const EDITOR_NAME = process.env.REACT_APP_EDITOR_NAME;
const EDITOR_VERSION = process.env.REACT_APP_EDITOR_VERSION;

const INPUT_TAGS = ['input', 'textarea'];

function findCategory(socket) {
    return socket.type?./*findType?.()*/data.category ?? socket.data.category ?? 'none';
}

// noinspection JSCheckFunctionSignatures
function createEditor(element) {

    let editor = new BlocksNodeEditor(EDITOR_NAME + '@' + EDITOR_VERSION, element);
    editor.use(ReactRenderPlugin, {
        component: NodeHandle,
    });
    // editor.use(HistoryPlugin); // TODO: set up undo/redo history
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
            // noinspection JSUnresolvedVariable
            if(!window.chrome) {
                editor.on('zoom', ({zoom}) => {
                    // Fix flickering grid on non-Chrome browsers
                    background.classList.toggle('far', zoom <= 1);
                    background.classList.toggle('d-none', zoom <= .5);
                });
            }
            editor.on('destroy', () => background.remove());
            return background;
        })(),
        snap: {size: 16, dynamic: true},
    });
    editor.use(ContextMenuPlugin);
    editor.use(ConnectionDropPlugin);
    editor.use(ConnectionOpacityPlugin);
    editor.use(VerticalSortPlugin);
    // noinspection JSCheckFunctionSignatures
    editor.use(DragButtonPlugin, {editorButton: 2});

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
            editor.nodes.forEach(node => node.update());
        }
    });

    editor.on('zoom', ({source}) => source !== 'dblclick'); // Prevent double-click zoom
    editor.on('nodeselect', node => !editor.selected.contains(node)); // Allow dragging multiple nodes
    editor.on('renderconnection', ({el, connection}) => {
        // TODO: update with socket type
        // let inputCategory = findCategory(connection.input.socket);
        // let outputCategory = findCategory(connection.output.socket);
        // if(connection.input.socket.data.reversed) {
        //     [inputCategory, outputCategory] = [outputCategory, inputCategory];
        // }
        // el.querySelector('.connection').classList.add(
        //     `socket-input-category-${inputCategory}`,
        //     `socket-output-category-${outputCategory}`,
        // );
        let category = findCategory((connection.input.socket.data.reversed ? connection.input : connection.output).socket);
        el.querySelector('.connection').classList.add(
            `socket-output-category-${category}`,
        );
    });

    return editor;
}


const EditorContainer = styled.div`
    width: 100%;
    height: 100vh;
`;

export default function Editor({hideMenu, onSetup, onChange, onSave, className, ...others}) {

    const events = useContext(EventsContext);
    const connectionAwareList = useContext(ConnectionAwareListContext);

    const [theme /* setTheme */] = useThemeState();

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

    const bindEditor = (element) => {
        if(editor) {
            editor.silent = true;
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
            // let key = String.fromCharCode(event.which).toLowerCase();
            let key = event.key;

            if(event.ctrlKey || event.metaKey) {
                // if(key === 'q') {
                //     editor.trigger('arrange');
                // }
                if(key === 's') {
                    event.preventDefault();
                    events.emit(EDITOR_SAVE_EVENT, editor);
                    console.log('Saved successfully');
                }
            }
            else if(!document.activeElement || !INPUT_TAGS.includes(document.activeElement.nodeName.toLowerCase())) {
                if(key === 'Delete') {
                    editor.selected.each(n => editor.removeNode(n));
                }
                else {
                    let block = SHORTCUT_KEYS.get(key);
                    if(block) {
                        editor.createNodeAtCursor(editor.getComponent(block.name))
                            .catch(err => events.emit('error', err));
                    }
                }
            }
        };
        document.addEventListener('keydown', onKeyDown);
        editor.on('destroy', () => document.removeEventListener('keydown', onKeyDown));

        for(let block of BLOCK_MAP.values()) {
            let node = new BlockComponent(block);
            editor.register(node);
        }

        let timeout;
        editor.on(['nodecreated', 'noderemoved', 'nodedragged', 'connectioncreated', 'connectionremoved'], async () => {
            if(!editor.silent) {
                // Debounce change events
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    events.emit(EDITOR_CHANGE_EVENT, editor);
                });
            }
        });
        editor.on('error', err => events.emit(ERROR_EVENT, err));

        async function loadState(state) {
            if(!state) {
                return false;
            }
            let result = await editor.fromJSON(state);
            if(result) {
                editor.view.resize();
                AreaPlugin.zoomAt(editor);
                events.emit(EDITOR_CHANGE_EVENT, editor);
                editor.nodes.forEach(node => node.update()); // Redraw nodes
            }
            return result;
        }

        (async () => {
            await onSetup?.(loadState, editor);
        })().catch(err => events.emit(ERROR_EVENT, err));

        // TODO: dry with rete-blocks-contextmenu-plugin
        const handleConnectionEnd = (startIO, endIO) => {
            currentIO = null;
            for(let listener of connectionAwareList) {
                listener(false, startIO, endIO);
            }
        };
        let currentIO = null;
        let connectionMouseMoved = false;
        editor.on('mousemove', m => {
            connectionMouseMoved = true;
        });
        editor.on('connectionpick', io => {
            connectionMouseMoved = false;
            if(currentIO) {
                handleConnectionEnd(currentIO, io);
                return;
            }
            let prevConnections = [...io.connections];
            setTimeout(() => {
                if(io.connections.length < prevConnections.length) {
                    // Connection is being removed
                    let connection = prevConnections.find(c => !io.connections.includes(c));
                    currentIO = (io === connection.input ? connection.output : connection.input);
                }
                else {
                    currentIO = io;
                }
                for(let listener of connectionAwareList) {
                    listener(true, currentIO);
                }
            });
        });
        editor.on('connectiondrop', io => {
            if(!connectionMouseMoved) {
                return;
            }
            let prevConnections = [...io.connections];
            setTimeout(() => {
                // Prevent activating if connections changed
                if(io.connections.length !== prevConnections.length || io.connections.some((conn, i) =>
                    (conn.input !== prevConnections[i].input) || (conn.output !== prevConnections[i].output))) {
                    return;
                }
                handleConnectionEnd(io);
            });
        });

        // const onMouseUp = event => {
        //     if(currentIO) {
        //         console.log(1234)
        //         handleConnectionEnd(currentIO);
        //     }
        // };
        // document.addEventListener('mouseup', onMouseUp);
        // editor.on('destroy', () => document.removeEventListener('mouseup', onMouseUp));
    };

    const loadFileContent = content => {
        try {
            let project = JSON.parse(content);
            events.emit(PROJECT_LOAD_EVENT, project);
        }
        catch(err) {
            events.emit(ERROR_EVENT, err);
        }
    };

    return (
        <FileDropZone options={{noClick: true}} onFileContent={loadFileContent}>
            <EditorContainer
                className={classNames('node-editor d-flex flex-grow-1 flex-column', 'theme-' + theme, className)}
                {...others}>
                {!hideMenu && (
                    <EditorMenu getEditor={() => editor} onLoadFileContent={loadFileContent}/>
                )}
                <div ref={bindEditor}/>
            </EditorContainer>
        </FileDropZone>
    );
}