import React, {useContext, useState} from 'react';
import AreaPlugin from 'rete-area-plugin';
import EventsContext, {
    EDITOR_CHANGE_EVENT,
    EDITOR_SAVE_EVENT,
    ERROR_EVENT,
    PROJECT_LOAD_EVENT,
} from '../../contexts/EventsContext';
import BlockComponent from '../../editor/components/BlockComponent';
import {BLOCK_MAP} from '../../editor/blocks';
import useListener from '../../hooks/utils/useListener';
import classNames from 'classnames';
import styled from 'styled-components';
import EditorMenu from './EditorMenu';
import FileDropZone from '../common/FileDropZone';
import {SHORTCUT_KEYS} from '../../editor/shortcutKeys';
import ConnectionAwareListContext from '../../contexts/ConnectionAwareListContext';
import OutputPanel from './OutputPanel';
import useAutosaveState from '../../hooks/settings/useAutosaveState';
import createEditor from '../../editor/createEditor';
import {EDITOR_STORE} from '../../observables/editorStore';

export const DROP_ZONE_EXTENSIONS = ['.blocks', '.blocks.json'];

const inputTags = ['input', 'textarea'];

const EditorContainer = styled.div`
    width: 100%;
    height: 100vh;
`;

export default function Editor({hideMenu, onSetup, onChange, onSave, className, ...others}) {
    const [editor, setEditor] = useState(null);
    const [autosave] = useAutosaveState();

    const events = useContext(EventsContext);
    const connectionAwareList = useContext(ConnectionAwareListContext);

    useListener(events, EDITOR_CHANGE_EVENT, (_editor) => {
        if(_editor === editor) {
            onChange?.(editor);
            if(autosave) {
                events.emit(EDITOR_SAVE_EVENT, editor);
            }
        }
    });
    useListener(events, EDITOR_SAVE_EVENT, (_editor) => {
        if(_editor === editor) {
            onSave?.(editor.toJSON(), editor);
        }
    });

    let element;

    const lastEditor = editor;
    const bindContainer = (container) => {
        if(lastEditor && !element) {
            lastEditor.silent = true;
            lastEditor.clear();
            lastEditor.components.clear();
            lastEditor.destroy();
        }
        if(!container) {
            return;
        }

        if(!element) {
            element = document.createElement('div');
        }
        container.append(element);

        let editor = lastEditor || createEditor(element);

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
            else if(!document.activeElement || !inputTags.includes(document.activeElement.nodeName.toLowerCase())) {
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
            // Remove connection on ctrl+click
            // noinspection JSDeprecatedSymbols, JSUnresolvedVariable
            if(window.event.ctrlKey) {
                let connection = io.connections[0];
                if(connection) {
                    editor.removeConnection(connection);
                }
                return false;
            }

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
        editor.on(['nodecreated', 'noderemoved', 'connectionremoved'], () => {
            handleConnectionEnd();
        });

        // const onMouseUp = event => {
        //     if(currentIO) {
        //         console.log(1234)
        //         handleConnectionEnd(currentIO);
        //     }
        // };
        // document.addEventListener('mouseup', onMouseUp);
        // editor.on('destroy', () => document.removeEventListener('mouseup', onMouseUp));

        setEditor(editor);
        EDITOR_STORE.set(editor);
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
        <FileDropZone options={{noClick: true, accept: DROP_ZONE_EXTENSIONS.join(',')}} onFileContent={loadFileContent}>
            <EditorContainer
                ref={bindContainer}
                className={classNames('node-editor d-flex flex-grow-1 flex-column', className)}
                {...others}>
                {editor && (
                    <>
                        {!hideMenu && (
                            <EditorMenu editor={editor} onLoadFileContent={loadFileContent}/>
                        )}
                        <OutputPanel editor={editor}/>
                    </>
                )}
            </EditorContainer>
        </FileDropZone>
    );
}