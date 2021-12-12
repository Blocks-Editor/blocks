export const hasNode = (editor, id) => {
    return editor.nodes.find(node => node.id === id);
};