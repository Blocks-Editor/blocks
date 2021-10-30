import Compiler from './Compiler';

export default class MotokoCompiler extends Compiler {
    constructor(editor) {
        super(editor, 'toMotoko');
    }

    defaultCompile(prop, node, key) {

    }

    postCompile(result, node, key) {
        if(Array.isArray(result)) {
            return result.filter(s => s).join(' ');
        }
        if(typeof result === 'string') {
            return result;
        }
        if(typeof result === 'number' || typeof result === 'boolean') {
            return result.toString();
        }
        if(result === undefined) {
            return;
        }
        console.warn('Unexpected Motoko expression:', result);
        return String(result);
    }
}