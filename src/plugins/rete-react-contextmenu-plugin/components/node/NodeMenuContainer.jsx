import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {deepCopy} from '../placement/PlacementMenuContainer';

const NodeMenuContainer = ({component: Component, node, editor, ...props}) => {
    const handleDelete = useCallback(() => {
        editor.selected.each((n) => {
            editor.removeNode(n);
        });
        editor.trigger('hidecontextmenu');
    }, [editor]);

    const handleClone = useCallback(async () => {
        const promises = [];

        const mappedNodes = {};

        editor.selected.each((n) => {
            promises.push((async () => {
                const component = editor.getComponent(n.name);
                const createdNode = await component.createNode(deepCopy(n.data));

                createdNode.meta = deepCopy(n.meta);
                createdNode.position[0] = n.position[0] + 25;
                createdNode.position[1] = n.position[1] + 25;

                editor.addNode(createdNode);

                mappedNodes[n.id] = createdNode;

                return {
                    originalNode: n,
                    createdNode,
                };
            })());
        });

        const createdNodes = await Promise.all(promises);

        createdNodes.forEach(({originalNode}) => {
            originalNode.inputs.forEach((input) => {
                input.connections.forEach((connection) => {
                    const newInputNode = mappedNodes[connection.input.node.id];
                    const newOutputNode = mappedNodes[connection.output.node.id];

                    if(!newInputNode || !newOutputNode) {
                        return;
                    }

                    const connectionInput = newInputNode.inputs.get(connection.input.key);
                    const connectionOutput = newOutputNode.outputs.get(connection.output.key);

                    if(!connectionInput || !connectionOutput) {
                        return false;
                    }

                    editor.connect(connectionOutput, connectionInput);
                });
            });

            editor.selected.remove(originalNode);
            originalNode.update();
        });

        const nodesToUpdate = [];
        createdNodes.forEach(({createdNode}) => {
            editor.selected.list.push(createdNode);
            nodesToUpdate.push(createdNode);
        });
        nodesToUpdate.forEach(n => n.update());

        editor.trigger('hidecontextmenu');
    }, [editor]);

    return (
        <Component
            onDelete={handleDelete}
            onClone={handleClone}
            editor={editor}
            node={node}
            {...props}
        />
    );
};

NodeMenuContainer.propTypes = {
    Component: PropTypes.any,
    node: PropTypes.object,
};

export default NodeMenuContainer;
