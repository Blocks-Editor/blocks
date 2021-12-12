import React from 'react';
import ReactDOM from 'react-dom';
import ContextMenu from './components/ContextMenu';
import {MenuContext} from './contexts/MenuContext';
import SelectionMenu from './components/menus/SelectionMenu';
import PlacementMenu from './components/menus/PlacementMenu';
import Rete from 'rete';
import {CONTEXT_MENU_STORE} from '../../observables/contextMenuStore';

// Adapted from https://github.com/michael-braun/rete-react-contextmenu-plugin

function install(editor, config = {}) {
    editor.bind('hidecontextmenu');
    editor.bind('showcontextmenu');

    let [offsetX, offsetY] = config.offset ? [config.offset.x, config.offset.y] : [-10, -10];

    let menu = null;

    editor.on('hidecontextmenu', () => {
        CONTEXT_MENU_STORE.set(null);
        if(menu) {
            menu.style.display = 'none';
        }
    });

    editor.on(['click', 'contextmenu'], () => {
        editor.trigger('hidecontextmenu');
    });

    editor.on('contextmenu', ({e, node, context}) => {
        e.preventDefault?.();
        // if(e.button === 2) {
        //     return;///
        // }
        e.stopPropagation?.();

        if(!context && e.ctrlKey) {
            context = {};////
        }

        if(!editor.trigger('showcontextmenu', {e, node, context})) {
            return;
        }

        // Select node under cursor
        if(node) {
            if(!editor.selected.contains(node)) {
                editor.selectNode(node);
            }
        }
        else {
            // editor.selected.clear();
        }

        const [x, y] = [e.clientX, e.clientY];

        if(!menu) {
            menu = document.createElement('div');
            editor.view.container.appendChild(menu);
        }
        const menuContext = {editor, mouse, node, context};
        CONTEXT_MENU_STORE.set(menuContext);

        menu.style.display = 'block';
        ReactDOM.render((
            <ContextMenu
                x={x + offsetX}
                y={node ? y - 50 : y + offsetY} // TODO: magic number
                handleCloseMenu={() => editor.trigger('hidecontextmenu')}>
                <MenuContext.Provider value={menuContext}>
                    {node ? (
                        <SelectionMenu/>
                    ) : (
                        <PlacementMenu/>
                    )}
                </MenuContext.Provider>
            </ContextMenu>
        ), menu);
    });

    editor.on('destroy', () => {
        editor.trigger('hidecontextmenu');
        if(menu) {
            menu.remove();
            menu = null;
        }
    });

    let mouse;
    let mouseEvent;
    let connectionMouseMoved = false;
    let removingConnection = false;

    editor.view.container.addEventListener('pointermove', e => mouseEvent = e);

    // // Open context menu on left click
    // editor.on('click', e => {
    //     editor.trigger('contextmenu', {e});
    // });

    editor.on('mousemove', m => {
        mouse = m;
        connectionMouseMoved = true;
    });

    editor.on('connectionpick', io => {
        connectionMouseMoved = false;
        let prevConnections = [...io.connections];
        setTimeout(() => {
            if(io.connections.length < prevConnections.length) {
                // Connection is being removed
                removingConnection = true;
            }
        });
    });

    editor.on('connectiondrop', io => {
        if(!connectionMouseMoved) {
            return;
        }
        if(removingConnection) {
            removingConnection = false;
            return;
        }
        let prevConnections = [...io.connections];
        setTimeout(() => {
            // Prevent activating if connections changed
            if(io.connections.length !== prevConnections.length || io.connections.some((conn, i) =>
                (conn.input !== prevConnections[i].input) || (conn.output !== prevConnections[i].output))) {
                return;
            }
            editor.trigger('contextmenu', {
                e: mouseEvent,
                context: {
                    input: io instanceof Rete.Input ? io : null,
                    output: io instanceof Rete.Output ? io : null,
                },
            });
        });
    });
}

const ContextMenuPlugin = {
    name: 'blocks-contextmenu',
    install,
};
export default ContextMenuPlugin;
