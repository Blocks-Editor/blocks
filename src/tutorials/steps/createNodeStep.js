import {hasNode} from '../helpers/hasNode';

export const createNodeStep = (name,id) => {
    return {
        isComplete(progress) {
            return hasNode(progress.editor, id);
        },
        setupNode(node, progress) {
            if(node.name === name) {
                node.id = id;
            }
        },
    };
};