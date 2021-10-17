import React, {useContext} from 'react';
import Rete from 'rete';
import AreaPlugin from 'rete-area-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
import ContextMenuPlugin from '../../plugins/rete-blocks-contextmenu-plugin';
import HistoryPlugin from 'rete-history-plugin';
import AutoArrangePlugin from 'rete-auto-arrange-plugin';
import ReactRenderPlugin from 'rete-react-render-plugin';
import EventsContext, {EDITOR_CHANGE_EVENT, ENGINE_NOTIFY_EVENT, ERROR_EVENT} from '../../contexts/EventsContext';
import NodeHandle from './nodes/NodeHandle';
import BlockComponent from '../../editor/components/BlockComponent';
import {BLOCK_MAP} from '../../editor/blocks';
import useListener from '../../hooks/useListener';
import BlocksNodeEditor from '../../editor/BlocksNodeEditor';
import VerticalSortPlugin from '../../plugins/rete-vertical-sort-plugin';

export default function Editor({onSetup, onChange}) {
    let name = process.env.REACT_APP_EDITOR_NAME;
    let version = process.env.REACT_APP_EDITOR_VERSION;

    let events = useContext(EventsContext);
    let editor = null;
    let engine = null;

    useListener(events, EDITOR_CHANGE_EVENT, () => {
        if(onChange) {
            onChange(editor, engine);
        }
    });

    useListener(events, ENGINE_NOTIFY_EVENT, async () => {
        if(editor && engine) {
            await engine.abort();
            await engine.process(editor.toJSON());

            events.emit(EDITOR_CHANGE_EVENT);
        }
    });

    let bindEditor = (element) => {
        if(editor) {
            console.log('CLEANUP--EDITOR');///
            editor.clear();
            editor.components.clear();
            editor.destroy();
            engine.destroy();
        }
        if(!element) {
            return;
        }

        let id = name + '@' + version;

        editor = new BlocksNodeEditor(id, element);
        editor.use(ReactRenderPlugin, {
            component: NodeHandle,
        });
        editor.use(HistoryPlugin);
        editor.use(ConnectionPlugin);
        // editor.use(CommentPlugin);
        // noinspection JSCheckFunctionSignatures
        editor.use(AutoArrangePlugin);
        // noinspection JSCheckFunctionSignatures
        editor.use(AreaPlugin, {
            background: (() => {
                let background = document.createElement('div');
                background.classList.add('grid');
                background.style.pointerEvents = 'none';
                return background;
            })(),
            snap: {size: 16, dynamic: true},
        });
        editor.use(ContextMenuPlugin);
        editor.use(VerticalSortPlugin);

        engine = new Rete.Engine(id);

        editor._engine = engine; ////////temp

        for(let block of BLOCK_MAP.values()) {
            let node = new BlockComponent(block);
            editor.register(node);
            engine.register(node);
        }

        editor.on(['nodecreated', 'noderemoved', 'nodedragged', 'connectioncreated', 'connectionremoved'], async () => {
            events.emit(ENGINE_NOTIFY_EVENT);
        });
        editor.on('zoom', ({source}) => {
            return source !== 'dblclick';
        });
        editor.on('click', ({e}) => {
            console.log(e)
            // Deselect on click background
            editor.selected.clear();
            editor.nodes.map(node => node.update());
        });
        editor.on('process', (...args) => {
            events.emit(EDITOR_CHANGE_EVENT);
        });
        editor.on('renderconnection', ({el, connection}) => {
            el.querySelector('.connection').classList.add(
                `socket-input-category-${connection.input.socket.data.category}`,
                `socket-output-category-${connection.output.socket.data.category}`,
            );
        });
        // editor.on(['renderconnection', 'updateconnection'], ({el, connection}) => {
        //     // Fade out distant connections
        //     setTimeout(() => {
        //         let minDistance = 500;
        //         let opacityFalloff = 200;
        //         let pathElement = el.querySelector('.main-path');
        //         let bounds = pathElement.getBoundingClientRect();
        //         let distance = bounds.width;
        //         pathElement.style.opacity = 1 / (1 + Math.sqrt(Math.max(distance - minDistance, 0) / opacityFalloff));
        //     });
        // });
        editor.on('error', err => events.emit(ERROR_EVENT, err));

        let onKeyPress = (e) => {
            if(e.code === 'KeyF') {
                editor.trigger('arrange');
            }
        };
        document.addEventListener('keypress', onKeyPress);
        editor.on('destroy', () => document.removeEventListener('keypress', onKeyPress));

        // editor.on('nodedragged', (node) => {
        //     events.emit(EDITOR_CHANGE_EVENT);
        // });

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
            return await editor.fromJSON(state);
        }

        (async () => {
            if(onSetup) {
                await onSetup(loadState, editor, engine);
            }

            editor.view.resize();
            AreaPlugin.zoomAt(editor);
            // events.emit(PROCESS_EVENT);
            // await engine.abort();
            // await engine.process(editor.toJSON());
            setTimeout(() => {
                events.emit(ENGINE_NOTIFY_EVENT);
            });
        })().catch(err => events.emit(ERROR_EVENT, err));
    };

    return (
        <div className="node-editor" style={{width: '100%', height: '100vh'}}>
            <div ref={bindEditor}/>
        </div>
    );
}