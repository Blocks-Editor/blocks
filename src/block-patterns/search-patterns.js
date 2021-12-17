export function findNodeSearchOptions(text, editor, componentName, nodeKey) {
    return editor.nodes.flatMap(node => {
        if(node.name === componentName) {
            const title = editor.compilers.motoko.getInput(node, 'name');
            if(title && title.startsWith(text)) {
                return [{
                    title,
                    data: {
                        [nodeKey]: node.id,
                    },
                }];
            }
        }
        return [];
    });
}
