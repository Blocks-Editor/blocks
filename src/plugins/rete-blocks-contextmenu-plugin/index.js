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

    const hideContextMenu = () => {
        CONTEXT_MENU_STORE.set(null);
        if(menu) {
            menu.style.display = 'none';
        }
    };

    editor.on(['hidecontextmenu', 'contextmenu', 'click'], hideContextMenu);

    editor.on('contextmenu', ({e, node, context, touch}) => {
        e.preventDefault?.();
        // if(e.button === 2) {
        //     return;///
        // }
        e.stopPropagation?.();

        if(!context && e.ctrlKey) {
            context = {};////
        }

        if(!editor.trigger('showcontextmenu', {e, node, context, touch})) {
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
                touch={touch}
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

    // // Mobile long press
    // const getPosition = event => {
    //     const touch = event.touches[0];
    //     return {
    //         x: touch.pageX,
    //         y: touch.pageY,
    //     };
    // };
    // let start;
    // let move;
    // let longPressTimeout;
    // let clickTimeout;
    // editor.view.container.addEventListener('touchstart', event => {
    //     // console.log('START')////
    //     start = getPosition(event);
    //     move = undefined;
    //     longPressTimeout = setTimeout(() => {
    //         // console.log('TIMEOUT')////
    //         const moveThreshold = 25;
    //         if(!move || !(Math.abs(start.x - move.x) > moveThreshold || Math.abs(start.y - move.y) > moveThreshold)) {
    //             vibrate(50);
    //             editor.trigger('contextmenu', {e: event});
    //         }
    //     }, 500);
    // });
    // editor.view.container.addEventListener('touchmove', event => {
    //     // console.log('MOVE')////
    //     move = getPosition(event);
    // });
    // editor.view.container.addEventListener('touchend', event => {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     // console.log('END')////
    //     clearTimeout(longPressTimeout);
    //     clearTimeout(clickTimeout);
    //     clickTimeout = setTimeout(() => clickTimeout = null, 300);
    // });

    // Mobile long press
    // let start;
    // let move;
    // let longPressTimeout;
    // let clickTimeout;
    // editor.view.container.addEventListener('touchstart', event => {
    //     // console.log('START')////
    //     start = getPosition(event);
    //     move = undefined;
    //     longPressTimeout = setTimeout(() => {
    //         // console.log('TIMEOUT')////
    //         const moveThreshold = 20;
    //         if(!move || !(Math.abs(start.x - move.x) > moveThreshold || Math.abs(start.y - move.y) > moveThreshold)) {
    //             vibrate(50);
    //             editor.trigger('contextmenu', {e: event});
    //         }
    //     }, 500);
    // });
    // editor.view.container.addEventListener('touchmove', event => {
    //     // console.log('MOVE')////
    //     move = getPosition(event);
    // });
    // editor.view.container.addEventListener('touchend', event => {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     // console.log('END')////
    //     clearTimeout(longPressTimeout);
    //     clearTimeout(clickTimeout);
    //     clickTimeout = setTimeout(() => clickTimeout = null, 300);
    // });

    // Hide context menu on mouse down
    editor.view.container.addEventListener('mousedown', e => {
        if(CONTEXT_MENU_STORE.get()) {
            hideContextMenu();
        }
    });

    const getPosition = event => {
        const touch = event.changedTouches?.[0];
        return touch ? {
            x: touch.pageX,
            y: touch.pageY,
        } : {};
    };

    // TODO: hide context menu and start dragging on `touchstart`

    let touchStart; // `true` during a touch event
    let touchNode; // selected context menu node
    let touchTimeout;
    let touchFlag = false;////
    editor.view.container.addEventListener('touchstart', e => {
        if(document.activeElement && !document.activeElement.contains(editor.view.container)) {
            // Skip if something has focus (e.g. a text input field)
            return;
        }

        if(CONTEXT_MENU_STORE.get()) {
            hideContextMenu();
        }
        else if(!editor.selected.list.length) {
            touchFlag = true;
            touchStart = getPosition(e);
            clearTimeout(touchTimeout);
            touchTimeout = setTimeout(() => {
                touchStart = null;
            }, 300);
        }
    });
    editor.view.container.addEventListener('touchend', e => {
        if(touchStart) {
            const {x, y} = getPosition(e);
            if(touchFlag && Math.abs(x - touchStart.x) + Math.abs(y - touchStart.y) < 20) {
                editor.trigger('contextmenu', {e, node: touchNode/*, touch: true*/});
                touchFlag = false;
                setTimeout(() => {
                    touchStart = null;
                    touchNode = null;
                }, 100);
            }
        }
    });

    // // Open touch placement menu when clicking empty space
    // editor.on('click', ({e}) => {
    //     if(touchStart) {
    //         editor.trigger('contextmenu', {e});
    //     }
    // });

    // Use selected node for touch context menu
    editor.on('selectnode', ({node}) => touchNode = node);

    // // Prevent node translation if newly selected
    // editor.on('nodetranslate', ({node}) => {
    //     if(nonTranslateNode === node) {
    //         return false;
    //     }
    // });
}

const ContextMenuPlugin = {
    name: 'blocks-contextmenu',
    install,
};
export default ContextMenuPlugin;
