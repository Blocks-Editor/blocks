import Compiler from './Compiler';
import {getType} from '../block-types/types';

export default class TypeCompiler extends Compiler {
    constructor(editor) {
        super(editor, 'inferType');
    }

    defaultCompile(prop, node) {
        return getType(prop.type);
    }

    postCompile(type, node, key) {
        if(type === undefined) {
            return;
        }
        type = getType(type);
        if(type.isAbstract()) {
            console.warn(`[${node.name}.${key}]`, 'Abstract inferred type:', type.toTypeString());
            return;
        }
        return type;
    }
}