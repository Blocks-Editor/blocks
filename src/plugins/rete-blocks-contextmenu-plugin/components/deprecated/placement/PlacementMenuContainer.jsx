import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {compatibleSocketInputComparator, compatibleSocketOutputComparator} from '../../../utils/socketComparators';

export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export async function createNode(component, {data = {}, meta = {}, x = 0, y = 0}) {
    const node = await component.createNode(deepCopy(data));

    node.meta = Object.assign(deepCopy(meta), node.meta);
    node.position[0] = x;
    node.position[1] = y;

    return node;
}

const PlacementMenuContainer = ({component: Component, node, editor, mousePositionStart, context, ...props}) => {
    const handleCreateNode = useCallback(async (component) => {
        const createdNode = await createNode(component, mousePositionStart);
        editor.addNode(createdNode);
        editor.trigger('hidecontextmenu');

        if(context?.output) {
            const foundInput = Array.from(createdNode.inputs.values()).find(compatibleSocketInputComparator(context.socket));

            if(foundInput) {
                editor.connect(context.output, foundInput);
            }
        }
        else if(context?.input) {
            const foundOutput = Array.from(createdNode.outputs.values()).find(compatibleSocketOutputComparator(context.socket));

            if(foundOutput) {
                editor.connect(foundOutput, context.input);
            }
        }
    }, [editor, mousePositionStart, context]);

    return (
        <Component
            editor={editor}
            node={node}
            context={context}
            onCreateNode={handleCreateNode}
            mousePositionStart={mousePositionStart}
            {...props}
        />
    );
};

PlacementMenuContainer.propTypes = {
    Component: PropTypes.any,
    node: PropTypes.object,
};

export default PlacementMenuContainer;
