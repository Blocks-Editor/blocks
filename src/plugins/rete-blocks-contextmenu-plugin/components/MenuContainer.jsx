import React from 'react';
import NodeMenu from './node/NodeMenu';
import NodeMenuContainer from './node/NodeMenuContainer';
import PlacementMenuContainer from './placement/PlacementMenuContainer';
import PlacementMenu from './placement/PlacementMenu';
import {
    COMPONENT_CONTEXT,
    COMPONENT_CONTEXT_CONTAINER,
    COMPONENT_NODE,
    COMPONENT_NODE_CONTAINER,
} from '..';

const MenuContainer = ({root, node, editor, x, y, mousePosition, mousePositionStart, components, context}) => {
    const Component = node
        ? (components[COMPONENT_NODE_CONTAINER] || NodeMenuContainer)
        : (components[COMPONENT_CONTEXT_CONTAINER] || PlacementMenuContainer);

    const ChildComponent = node
        ? (components[COMPONENT_NODE] || NodeMenu)
        : (components[COMPONENT_CONTEXT] || PlacementMenu);

    return (
        <Component
            context={context}
            component={ChildComponent}
            x={x}
            y={y}
            mousePosition={mousePosition}
            mousePositionStart={mousePositionStart}
            node={node}
            editor={editor}
            root={root}
        />
    );
};

MenuContainer.propTypes = {};

export default MenuContainer;
