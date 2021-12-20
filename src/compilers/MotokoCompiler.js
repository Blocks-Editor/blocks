import Compiler from './Compiler';
import {identifierType, typeType} from '../block-types/types';
import nodeIdentifierRef from './utils/nodeIdentifierRef';

export function importRef(name) {
    return `$import$"${name}"`;
}

export function resolveImportRefs(code) {
    if(!code) {
        return [[], ''];
    }
    code = String(code);

    const imports = {};
    code = code.replace(/\$import\$"([^"]*)"/g, (match, path) => {
        const id = path.includes('/') ? path.substring(path.lastIndexOf('/') + 1) : path;
        if(imports.hasOwnProperty(id) && imports[id] !== path) {
            throw new Error(`Conflicting import paths: "${path}" != "${imports[id]}"`);
        }
        imports[id] = path;
        return id;
    });
    let prefixes = Object.entries(imports).map(([id, path]) => `import ${id} "${path}";`);
    return [prefixes, code];
}

export default class MotokoCompiler extends Compiler {
    constructor(editor) {
        super(editor, 'toMotoko');
    }

    defaultCompile(prop, node) {
        // TODO: refactor these special cases

        if(identifierType.isSubtype(prop.type)) {
            // console.log(node.name)///
            return nodeIdentifierRef(node, prop.key);
        }

        if(typeType.isSubtype(prop.type)) {
            let type = prop.type.generics[0];
            if(type && !type.isAbstract()) {
                return this.getTypeString(type);
            }
        }
    }

    postCompile(result, node, key) {
        if(typeof result === 'string' || typeof result === 'number' || typeof result === 'boolean' || result === null || result === undefined) {
            return result;
        }
        if(Array.isArray(result)) {
            return result.map(r => this.postCompile(r, node, key)).filter(s => s).join(' ');
        }
        console.warn('Unexpected Motoko expression:', result);
        return String(result);
    }
}