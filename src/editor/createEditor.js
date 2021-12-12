// noinspection JSCheckFunctionSignatures

import BlocksNodeEditor from './BlocksNodeEditor';
import ReactRenderPlugin from 'rete-react-render-plugin';
import NodeHandle from '../components/rete/nodes/NodeHandle';
import ConnectionPlugin from 'rete-connection-plugin';
import AutoArrangePlugin from 'rete-auto-arrange-plugin';
import AreaPlugin from 'rete-area-plugin';
import ContextMenuPlugin from '../plugins/rete-blocks-contextmenu-plugin';
import ConnectionDropPlugin from '../plugins/rete-connection-drop-plugin';
import ConnectionOpacityPlugin from '../plugins/rete-connection-opacity-plugin';
import VerticalSortPlugin from '../plugins/rete-vertical-sort-plugin';
import DragButtonPlugin from '../plugins/rete-drag-button-plugin';
import {RECENTLY_CREATED_NODE_STORE} from '../observables/recentlyCreatedNodeStore';


const editorName = process.env.REACT_APP_EDITOR_NAME;
const editorVersion = process.env.REACT_APP_EDITOR_VERSION;

function findCategory(socket) {
    return socket.type?./*findType?.()*/data.category ?? socket.data.category ?? 'none';
}

export default function createEditor(element) {

    let editor = new BlocksNodeEditor(editorName + '@' + editorVersion, element);
    editor.use(ReactRenderPlugin, {
        component: NodeHandle,
    });
    // editor.use(HistoryPlugin); // TODO: set up undo/redo history
    editor.use(ConnectionPlugin);
    // editor.use(SelectionPlugin, {
    //     enabled: true,
    // });
    editor.use(AutoArrangePlugin);
    editor.use(AreaPlugin, {
        background: (() => {
            let background = document.createElement('div');
            background.classList.add('grid');
            background.style.pointerEvents = 'none';
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
        let category = findCategory((connection.input.socket.data.reversed ? connection.input : connection.output).socket);
        el.querySelector('.connection').classList.add(
            `socket-output-category-${category}`,
        );
    });

    editor.on('nodecreated',node=>{
        RECENTLY_CREATED_NODE_STORE.set(node)
    })

    return editor;
}