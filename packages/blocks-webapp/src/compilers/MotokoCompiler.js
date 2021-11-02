import Compiler from './Compiler';

export default class MotokoCompiler extends Compiler {
    constructor(editor) {
        super(editor, 'toMotoko');
    }

    defaultCompile(prop, node, key) {
    }

    postCompile(result, node, key) {
        if(typeof result === 'string' || typeof result === 'number' || typeof result === 'boolean' || result === null) {
            return result;
        }
        if(result === undefined) {
            return;
        }
        if(Array.isArray(result)) {
            return result.map(r => this.postCompile(r, node, key)).filter(s => s).join(' ');
        }
        console.warn('Unexpected Motoko expression:', result);
        return String(result);
    }
}