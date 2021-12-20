import React, {useContext} from 'react';
import AreaPlugin from 'rete-area-plugin';
import EventsContext, {EDITOR_CHANGE_EVENT, EDITOR_SAVE_EVENT, ERROR_EVENT} from '../../contexts/EventsContext';
import BlockComponent from '../../editor/components/BlockComponent';
import {BLOCK_MAP} from '../../editor/blocks';
import useListener from '../../hooks/utils/useListener';
import {SHORTCUT_KEYS} from '../../editor/shortcutKeys';
import ConnectionAwareListContext from '../../contexts/ConnectionAwareListContext';
import useAutosaveState from '../../hooks/persistent/useAutosaveState';
import createEditor from '../../editor/createEditor';
import ReactTooltip from 'react-tooltip';
import useTimeout from '../../hooks/utils/useTimeout';

const inputTags = ['input', 'textarea'];


export default function EditorWrapper({observable, onSetup, onChange, onSave, history}) {
    const [autosave] = useAutosaveState();

    const events = useContext(EventsContext);
    const connectionAwareList = useContext(ConnectionAwareListContext);

    let editor;

    useListener(events, EDITOR_CHANGE_EVENT, (_editor) => {
        if(_editor === editor) {
            editor.trigger('change');
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

    const bindElement = (container) => {
        if(editor) {
            editor.silent = true;
            editor.clear();
            editor.components.clear();
            editor.destroy();
            editor = null;
        }
        if(!container) {
            return;
        }

        editor = createEditor(container, {
            history,
        });

        window.EDITOR = editor; // Browser debugging

        const onKeyDown = (event) => {
            const key = event.key;

            if(event.ctrlKey || event.metaKey) {
                // if(key === 'q') {
                //     editor.trigger('arrange');
                // }
                if(key === 's') {
                    event.preventDefault();
                    events.emit(EDITOR_SAVE_EVENT, editor);
                    console.log('Saved successfully');
                }
                if(key === 'z') {
                    editor.trigger(event.shiftKey ? 'redo' : 'undo');
                }
                if(key === 'y') {
                    editor.trigger('redo');
                }
            }
            else if(!document.activeElement || !inputTags.includes(document.activeElement.nodeName.toLowerCase())) {
                if(key === 'Delete') {
                    editor.selected.each(n => editor.removeNode(n));
                    ReactTooltip.hide();
                }
                else {
                    const block = SHORTCUT_KEYS.get(key);
                    if(block) {
                        editor.createNodeAtCursor(editor.getComponent(block.name))
                            .catch(err => events.emit('error', err));
                    }
                }
            }
        };
        document.addEventListener('keydown', onKeyDown);
        editor.on('destroy', () => document.removeEventListener('keydown', onKeyDown));

        for(const block of BLOCK_MAP.values()) {
            const node = new BlockComponent(block);
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

        // TODO: dry with rete-blocks-contextmenu-plugin
        const handleConnectionEnd = (startIO, endIO) => {
            currentIO = null;
            for(const listener of connectionAwareList) {
                listener(false, startIO, endIO);
            }
        };
        let currentIO = null;
        let connectionMouseMoved = false;
        editor.on('mousemove', () => {
            connectionMouseMoved = true;
        });
        editor.on('connectionpick', io => {
            // noinspection JSUnresolvedVariable
            if(window.event.button !== 0) {
                return; // Rete.js hotfix
            }

            // Remove connection on ctrl+click
            const connection = io.connections[0];
            // noinspection JSDeprecatedSymbols, JSUnresolvedVariable
            if(window.event.ctrlKey) {
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
            const prevConnections = [...io.connections];
            setTimeout(() => {
                if(io.connections.length < prevConnections.length) {
                    // Connection is being removed
                    const connection = prevConnections.find(c => !io.connections.includes(c));
                    currentIO = (io === connection.input ? connection.output : connection.input);
                }
                else {
                    currentIO = io;
                }
                for(const listener of connectionAwareList) {
                    listener(true, currentIO);
                }
            });
        });
        editor.on('connectiondrop', io => {
            if(!connectionMouseMoved) {
                return;
            }
            const prevConnections = [...io.connections];
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
        //         handleConnectionEnd(currentIO);
        //     }
        // };
        // document.addEventListener('mouseup', onMouseUp);
        // editor.on('destroy', () => document.removeEventListener('mouseup', onMouseUp));
    };

    async function loadState(state) {
        if(!state) {
            return false;
        }
        const result = await editor.fromJSON(state);
        if(result) {
            editor.view.resize();
            AreaPlugin.zoomAt(editor);
            editor.nodes.forEach(node => node.update()); // Redraw nodes
            // TODO: remove setTimeout() workaround
            setTimeout(() => events.emit(EDITOR_CHANGE_EVENT, editor));
            // events.emit(EDITOR_CHANGE_EVENT, editor);
        }
        return result;
    }

    useTimeout(() => (async () => {
        await onSetup?.(loadState, editor);
        observable.set(editor);
    })().catch(err => events.emit(ERROR_EVENT, err)));

    return (
        <div className="h-100" ref={bindElement}/>
    );
}