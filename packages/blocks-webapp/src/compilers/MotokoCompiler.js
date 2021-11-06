import Compiler from './Compiler';
import {typeType} from '../block-types/types';

export function nodeVariableRef(node) {
    let id = typeof node === 'number' || typeof node === 'string' ? String(node) : node.id;
    return `node__${id}`;
}

export function importRef(name) {
    return `$import$"${name}"`;
}

export function resolveImportRefs(code) {
    if(!code) {
        return code;
    }
    code = String(code);

    const imports = {};
    code = code.replace(/\$import\$"([^"]*)"/, (match, path) => {
        const id = path.includes('/') ? path.substring(path.lastIndexOf('/') + 1) : path;
        if(imports.hasOwnProperty(id) && imports[id] !== path) {
            throw new Error(`Conflicting import paths: "${path}" != "${imports[id]}"`);
        }
        imports[id] = path;
        return id;
    });
    for(const [id, path] of Object.entries(imports)) {
        code = `import ${id} "${path}"; ${code}`;
    }
    return code;
}

export default class MotokoCompiler extends Compiler {
    constructor(editor) {
        super(editor, 'toMotoko');
    }

    defaultCompile(prop, node, key) {
        if(typeType.isSubtype(prop.type)) {
            let type = prop.type.generics[0];
            if(type && !type.isAbstract()) {
                return this.getTypeString();
            }
        }
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