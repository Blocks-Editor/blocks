import Compiler from './Compiler';

export default class ControlCompiler extends Compiler {
    constructor(editor) {
        super(editor, 'toControl');
    }

    defaultCompile(prop, node, key) {
    }

    postCompile(result, node, key) {
        return result;
    }
}