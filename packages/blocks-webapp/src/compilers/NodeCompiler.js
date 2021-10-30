import Compiler from './Compiler';

export default class NodeCompiler extends Compiler {
    constructor(editor) {
        super(editor, 'toEditorNode');
    }

    defaultCompile(prop, node, key) {
        return node;
    }

    postCompile(result, node, key) {
        if(!result) {
            return;
        }
        let id;
        if(typeof result === 'object') {
            id = result.id;
            if(!id) {
                throw new Error(`Invalid node object with keys: {${Object.keys(result).join(', ')}}`);
            }
        }
        else {
            id = result;
        }
        // Convert node id to string in case of number/string mismatch
        id = String(id);
        return this.editor.nodes.find(n => String(n.id) === id);
    }
}