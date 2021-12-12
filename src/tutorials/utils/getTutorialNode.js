export const getTutorialNode = (editor, id) => {
    return editor.nodes.find(node => node.id === id);
};