import {getBlock} from '../editor/blocks';
import Rete from 'rete';
import {getType} from '../block-types/types';

export class UndefinedInputError extends Error {
    constructor(block, key) {
        super(`${block.name}.${key}`);
    }
}

export default class Compiler {
    constructor(editor, compileKey) {
        this.editor = editor;
        this.compileKey = compileKey;

        this._caching = false;
        this._inputCache = new Map();
        this._outputCache = new Map();
    }

    // Default output value if `[compileKey]` does not exist on block property
    defaultCompile(prop, node) {
    }

    // Post-process results from either `prop[compileKey]` or `defaultCompile(..)`
    postCompile(result, node, key) {
        return result;
    }

    getNode(node, silent = false) {
        if(node instanceof Rete.Node) {
            return node;
        }
        if(!node) {
            throw new Error(`Node cannot be ${JSON.stringify(node)}`);
        }
        const id = String(typeof node === 'string' || typeof node === 'number' ? node : node.id);
        node = this.editor.nodes.find(node => String(node.id) === id);
        if(!node && !silent) {
            throw new Error(`Node does not exist: ${id}`);
        }
        return node;
    }

    getBlock(node) {
        node = this.getNode(node);
        return getBlock(node.name);
    }

    getInput(node, key) {
        node = this.getNode(node, true);
        if(!node) {
            return;
        }
        const cacheKey = this._cacheKey(node, key);
        if(this._caching && this._inputCache.has(cacheKey)) {
            return this._inputCache.get(cacheKey);
        }
        this._inputCache.set(cacheKey, undefined);
        let result = this._getInput(node, key);
        this._inputCache.set(cacheKey, result);
        return result;
    }

    _getInput(node, key) {
        const block = this.getBlock(node);
        if(!block.props.hasOwnProperty(key)) {
            throw new Error(`Prop not found on ${node.name}: ${key}`);
        }
        const prop = block.props[key];
        let result = this._resolveInput(node, prop);
        if(result === undefined && !prop.optional) {
            result = prop.type?.data.defaultInput?.(prop, node);
        }
        return result;
    }

    _resolveInput(node, prop) {
        if(prop.input) {
            if(!prop.type.data.reversed) {
                const input = this._input(node, prop.key);
                if(prop.multi) {
                    return input.connections.map(c => this._compileConnection(c, c.input, c.output, 'outputs'));
                }
                if(input.connections.length) {
                    const c = input.connections[0];
                    return this._compileConnection(c, c.input, c.output, 'outputs');
                }
                if(input.control) {
                    // return input.control.getValue();
                    return this._compileControl(input.control, prop);
                }
            }
            else {
                const output = this._output(node, prop.key);
                if(prop.multi) {
                    return output.connections.map(c => this._compileConnection(c, c.output, c.input, 'inputs'));
                }
                if(output.connections.length) {
                    const c = output.connections[0];
                    return this._compileConnection(c, c.output, c.input, 'inputs');
                }
            }
        }

        if(prop.control) {
            const control = this._control(node, prop.key);
            return this._compileControl(control, prop);
        }
    }

    getOutput(node, key) {
        node = this.getNode(node, true);
        if(!node) {
            return;
        }
        const cacheKey = this._cacheKey(node, key);
        if(this._caching && this._outputCache.has(cacheKey)) {
            return this._outputCache.get(cacheKey);
        }
        this._outputCache.set(cacheKey, undefined);
        const result = this._getOutput(node, key);
        this._outputCache.set(cacheKey, result);
        return result;
    }

    _getOutput(node, key) {
        const prop = this._prop(node, key);
        try {
            const args = this.getInputArgs(node);
            if(!args) {
                return;
            }
            let result = prop[this.compileKey]?.(args, node, this);
            if(result === undefined) {
                result = this.defaultCompile(prop, node);
            }
            return this.postCompile(result, node, key);
        }
        catch(err) {
            if(err instanceof UndefinedInputError) {
                return;
            }
            console.error(`[${node.name}.${key}]`, err);
            this.editor.trigger('warn', `[${node.name}.${key}] ${err}`);
        }
    }

    getInputArgs(node) {
        node = this.getNode(node, true);
        let args = {};
        if(!node) {
            return args;
        }
        const block = this.getBlock(node);
        for(const prop of Object.values(block.props)) {
            if(prop.input || prop.control) {
                // Lazy-compile inputs
                let loaded = false;
                let loadedValue;
                Object.defineProperty(args, prop.key, {
                    get: () => {
                        if(loaded) {
                            return loadedValue;
                        }
                        let value = this.getInput(node, prop.key);
                        if(value === undefined && !prop.optional) {
                            throw new UndefinedInputError(block, prop.key);
                        }
                        loaded = true;
                        return value;
                    },
                });
            }
        }
        if(process.env.NODE_ENV !== 'production') {
            // Throw error on missing key
            const target = args;
            args = new Proxy({}, {
                get: (_, key) => {
                    if(!target.hasOwnProperty(key)) {
                        throw new Error(`Unknown input: ${block.name}.${key}`);
                    }
                    return target[key];
                },
            });
        }
        return args;
    }

    clearCache() {
        this._inputCache.clear();
        this._outputCache.clear();
    }

    getTypeString(type) {
        type = getType(type);
        const generics = type.generics.map(t => this.getTypeString(t));
        return type?.data[this.compileKey]?.call(type, generics, this) || (generics.length ? `${type.name}<${generics.join(', ')}>` : type.name);
    }

    inferType(node, key) {
        return this.editor.compilers.type.getInput(node, key);
    }

    _compileConnection(connection, from, to) {
        return this.getOutput(to.node, to.key);
    }

    _compileControl(control, prop) {
        const node = control.getNode();
        let value = control.getValue();
        if(value === undefined) {
            value = this.defaultCompile(prop, node);
        }
        return this.postCompile(value, node, prop.key);
    }

    _prop(node, key) {
        const block = this.getBlock(node);
        if(!block.props.hasOwnProperty(key)) {
            throw new Error(`Prop does not exist in ${node.name}: ${key}`);
        }
        return block.props[key];
    }

    _input(node, key) {
        if(!node.inputs.has(key)) {
            throw new Error(`Input not found on ${node.name}: ${key}`);
        }
        return node.inputs.get(key);
    }

    _output(node, key) {
        if(!node.outputs.has(key)) {
            throw new Error(`Output not found on ${node.name}: ${key}`);
        }
        return node.outputs.get(key);
    }

    _control(node, key) {
        if(!node.controls.has(key)) {
            throw new Error(`Control not found on ${node.name}: ${key}`);
        }
        return node.controls.get(key);
    }

    _cacheKey(node, key) {
        return `${node.id}.${key}`;
    }
}