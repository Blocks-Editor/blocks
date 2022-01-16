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
        // if(typeof type === 'string' || typeof type === 'number' || typeof type === 'boolean' || type === null || type === undefined) {
        //     return type;/////////
        // }
        if(type === undefined) {
            return;
        }
        if(typeof type === 'string' || typeof type === 'number' || typeof type === 'boolean') {
            // TODO: ensure type inputs passed as objects rather than strings
            // console.log('String type:', type, node, key);
            return type;
        }
        type = getType(type);
        if(type.isAbstract()) {
            console.warn(`[${node.name}.${key}]`, 'Abstract inferred type:', type.toTypeString());
            return;
        }
        return type;
    }
}