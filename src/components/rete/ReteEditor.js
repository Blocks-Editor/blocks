import React, {useContext} from 'react';
import Rete from 'rete';
import AreaPlugin from 'rete-area-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
import ConnectionMasteryPlugin from 'rete-connection-mastery-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import HistoryPlugin from 'rete-history-plugin';
import CommentPlugin from 'rete-comment-plugin';
import ReactRenderPlugin from 'rete-react-render-plugin';
import EventsContext, {EDITOR_PROCESS_EVENT, ERROR_EVENT} from '../../contexts/EventsContext';
import ReteNodeHandle from './nodes/ReteNodeHandle';
import BlockComponent from '../../editor/components/BlockComponent';
import {basename} from 'path';

export default function ReteEditor({onSetup, onChange}) {
    let name = process.env.REACT_APP_EDITOR_NAME;
    let version = process.env.REACT_APP_EDITOR_VERSION;

    let events = useContext(EventsContext);
    let editor;

    ///
    // useListener(events, EDITOR_PROCESS_EVENT, () => {
    //     let compiler = new Compiler(editor);
    //     let result = compiler.compile('2');///////
    //     console.log('Compiled:', result);
    // });

    let setupEditor = (element) => {
        if(!element) {
            if(editor) {
                editor.clear();
                editor.destroy();
            }
            return;
        }

        let id = name + '@' + version;

        let nodes = [
            // new DebugComponent(),
        ];
        let blockNames = new Set();
        let blockContext = require.context('../../blocks', true, /\.js$/);
        blockContext.keys().forEach(path => {
            // Load block kind configurations
            let name = basename(path, '.js');
            let block = blockContext(path).default;
            block.name = name;
            if(blockNames.has(name)) {
                console.error(`Duplicate block name: ${name}`);
                return;
            }
            blockNames.add(name);
            // noinspection JSCheckFunctionSignatures
            nodes.push(new BlockComponent(name, block));
        });

        editor = new Rete.NodeEditor(id, element);
        editor.use(ReactRenderPlugin, {
            component: ReteNodeHandle,
        });
        editor.use(HistoryPlugin);
        editor.use(CommentPlugin);
        editor.use(ConnectionPlugin);
        editor.use(ConnectionMasteryPlugin);
        editor.use(ContextMenuPlugin); // TODO: completely replace

        let engine = new Rete.Engine(id);

        nodes.forEach(node => {
            editor.register(node);
            engine.register(node);
        });

        editor.on(['process', 'nodecreated', 'noderemoved', 'connectioncreated', 'connectionremoved'], async () => {
            await engine.abort();

            // await editor.trigger('process');
            if(onChange) {
                onChange(editor, engine);
            }
        });
        editor.on('zoom', ({source}) => {
            return source !== 'dblclick';
        });
        editor.on('process', (...args) => events.emit(EDITOR_PROCESS_EVENT, ...args));
        editor.on('error', err => events.emit(ERROR_EVENT, err));

        // events.on(PROCESS_EVENT, (...args) => editor.trigger('process', ...args));

        (async () => {
            if(onSetup) {
                await onSetup(editor, engine);
            }

            editor.view.resize();
            AreaPlugin.zoomAt(editor);
            // events.emit(PROCESS_EVENT);
            editor.trigger('process');
        })().catch(err => events.emit(ERROR_EVENT, err));
    };

    return (
        <div style={{width: '100%', height: '100vh'}}>
            <div ref={setupEditor}/>
        </div>
    );
}