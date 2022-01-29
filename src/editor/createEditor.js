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
import PositionSortPlugin from '../plugins/rete-position-sort-plugin';
import DragButtonPlugin from '../plugins/rete-drag-button-plugin';
import {CREATE_NODE_STORE} from '../observables/createNodeStore';
import HistoryPlugin from '../plugins/rete-blocks-history-plugin';
import {EDITOR_SELECTION_STORE} from '../observables/editorSelectionStore';


export const EDITOR_NAME = process.env.REACT_APP_EDITOR_NAME;
export const EDITOR_VERSION = process.env.REACT_APP_EDITOR_VERSION;

function findCategory(socket) {
    return socket.type?./*findType?.()*/data.category ?? socket.data.category ?? 'none';
}

export default function createEditor(container, {history} = {}) {

    const editor = new BlocksNodeEditor(EDITOR_NAME + '@' + EDITOR_VERSION, container);
    editor.use(ReactRenderPlugin, {
        component: NodeHandle,
    });
    editor.use(HistoryPlugin, {history});
    editor.use(ConnectionPlugin);
    // editor.use(SelectionPlugin, {
    //     enabled: true,
    // });
    editor.use(AutoArrangePlugin);
    editor.use(AreaPlugin, {
        background: (() => {
            const background = document.createElement('div');
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
    editor.use(PositionSortPlugin);
    editor.use(DragButtonPlugin, {editorButton: 2});

    // Notify selection changed
    const updateSelection = () => setTimeout(() => {
        const previous = EDITOR_SELECTION_STORE.get();
        const current = editor.selected.list;
        if(previous.length !== current.length || previous.some((x, i) => x !== current[i])) {
            EDITOR_SELECTION_STORE.set([...current]);
        }
    });

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
        updateSelection();
    });

    editor.on('zoom', ({source}) => source !== 'dblclick'); // Prevent double-click zoom
    editor.on('nodeselect', node => !editor.selected.contains(node)); // Allow dragging multiple nodes
    editor.on('nodeselected', () => updateSelection());
    editor.on('renderconnection', ({el, connection}) => {
        el.style.zIndex = '-10';
        const category = findCategory((connection.input.socket.data.reversed ? connection.input : connection.output).socket);
        el.querySelector('.connection').classList.add(
            `socket-output-category-${category}`,
        );
    });

    editor.on('nodecreate', node => {
        // Ensure unique node ID
        while(editor.nodes.some(other => node !== other && node.id === other.id)) {
            // noinspection JSValidateTypes
            node.id = Math.random().toString(36).slice(2, 8);
        }
    });
    editor.on('nodecreated', node => {
        CREATE_NODE_STORE.set(node);
    });

    return editor;
}