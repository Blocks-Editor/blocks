import {getTutorialNode} from '../utils/getTutorialNode';

export const createNodeStep = (name, id) => {
    return {
        isComplete(progress) {
            return getTutorialNode(progress.editor, id);
        },
        setupNode(node, progress) {
            if(node.name === name && !getTutorialNode(progress.editor, id)) {
                node.id = id;
            }
        },
    };
};