import React from 'react';
import ReactDOM from 'react-dom';
import MenuContainer from './components/MenuContainer';
import {OptionsContext} from './contexts/OptionsContext';

// Derived from: https://github.com/michael-braun/rete-react-contextmenu-plugin

function install(editor, {
    components = {},
    contextComparator = ((a, b) => false),
} = {}) {
    editor.bind('hidecontextmenu');
    editor.bind('showcontextmenu');

    let menu = document.createElement('div');
    editor.view.container.appendChild(menu);

    editor.on('hidecontextmenu', () => {
        if(menu) {
            menu.style.display = 'none';
        }
    });

    editor.on('click contextmenu', () => {
        editor.trigger('hidecontextmenu');
    });

    const mousePosition = {x: 0, y: 0};

    let lastConnectionStart = null;
    editor.on('rendersocket', ({el, socket, input, output}) => {
        const connected = {
            current: input?.hasConnection?.() || false,
        };

        if(input) {
            editor.on('connectioncreated', (connection) => {
                if(connection.input === input) {
                    connected.current = connection.input.hasConnection();
                }
            });
        }

        el.addEventListener('pointerdown', () => {
            if(lastConnectionStart) {
                lastConnectionStart = null;
            }
            else {
                lastConnectionStart = {
                    socket,
                    input: input || null,
                    output: output || null,
                    node: input?.node || output?.node,
                    connected,
                };
            }
        });

        el.addEventListener('pointerup', () => {
            if(input && lastConnectionStart) {
                lastConnectionStart.connected.current = input.hasConnection();
            }

            lastConnectionStart = null;
        });
    });

    editor.view.container.addEventListener('pointerup', (e) => {
        if(!lastConnectionStart || lastConnectionStart.connected.current) {
            if(lastConnectionStart?.input) {
                lastConnectionStart.connected.current = lastConnectionStart.input.hasConnection();
            }

            lastConnectionStart = null;
            return;
        }

        const connectionStart = lastConnectionStart;
        lastConnectionStart = null;
        editor.trigger('contextmenu', {e, node: null, context: connectionStart});
    });

    editor.on('mousemove', ({x, y}) => {
        mousePosition.x = x;
        mousePosition.y = y;
    });

    const contextOptions = {
        components,
        contextComparator,
    };

    editor.on('contextmenu', ({e, node, context}) => {
        e.preventDefault();
        e.stopPropagation();

        if(!editor.trigger('showcontextmenu', {e, node})) return;

        if(node) {
            editor.selectNode(node);
        }

        const [x, y] = [e.clientX, e.clientY];

        menu.style.display = 'block';
        ReactDOM.render((
            <OptionsContext.Provider value={contextOptions}>
                <MenuContainer
                    editor={editor}
                    node={node}
                    root={menu}
                    context={context}
                    x={x}
                    y={y}
                    mousePosition={mousePosition}
                    mousePositionStart={{...mousePosition}}
                    components={components}
                />
            </OptionsContext.Provider>
        ), menu);
    });
}

export const COMPONENT_NODE = 'node';
export const COMPONENT_NODE_CONTAINER = 'node-container';
export const COMPONENT_CONTEXT = 'context';
export const COMPONENT_CONTEXT_CONTAINER = 'context-container';

const ContextMenuPlugin = {
    name: 'context-menu',
    install,
};
export default ContextMenuPlugin;
