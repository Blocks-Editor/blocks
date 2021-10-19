import React from 'react';
import ReactDOM from 'react-dom';
import ContextMenu from './components/ContextMenu';
import {MenuContext} from './contexts/MenuContext';
import SelectionMenu from './components/menus/SelectionMenu';
import PlacementMenu from './components/menus/PlacementMenu';

// Adapted from https://github.com/michael-braun/rete-react-contextmenu-plugin

function install(editor, config = {}) {
    editor.bind('hidecontextmenu');
    editor.bind('showcontextmenu');

    let [offsetX, offsetY] = config.offset ? [config.offset.x, config.offset.y] : [-10, -10];

    let menu = null;

    editor.on('hidecontextmenu', () => {
        if(menu) {
            menu.style.display = 'none';
        }
    });

    editor.on(['click', 'contextmenu'], () => {
        editor.trigger('hidecontextmenu');
    });

    editor.on('contextmenu', ({e, node, context}) => {
        e.preventDefault?.();
        e.stopPropagation?.();

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
        menu.style.display = 'block';
        ReactDOM.render((
            <ContextMenu
                x={x + offsetX}
                y={y + offsetY}
                handleCloseMenu={() => editor.trigger('hidecontextmenu')}>
                <MenuContext.Provider value={{editor, mouse, node, context}}>
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
        if(menu) {
            menu.remove();
            menu = null;
        }
    });

    let mouse;
    let mouseEvent;
    let removingConnection = false;

    editor.view.container.addEventListener('mousemove', e => mouseEvent = e);
    // editor.view.container.addEventListener('drag', e => {
    //     console.log(123)
    //     mouseEvent = e
    // });

    editor.on('mousemove', m => mouse = m);

    editor.on('connectionpick', io => {
        let prevConnections = [...io.connections];
        setTimeout(() => {
            if(io.connections.length < prevConnections.length) {
                // Connection is being removed
                removingConnection = true;
            }
        });
    });

    editor.on('connectiondrop', io => {
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
                    io,
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
