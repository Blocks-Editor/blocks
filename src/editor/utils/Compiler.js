import {BLOCK_MAP} from '../blocks';
import Rete from 'rete';
import {getSocket} from '../sockets';

export default class Compiler {
    constructor(editor) {
        this.editor = editor;
    }

    getNode(node) {
        if(node instanceof Rete.Node) {
            return node;
        }
        let id = typeof node === 'string' ? node : node.id;
        return this.editor.nodes.find(node => node.id === id);
    }

    getBlock(node) {
        node = this.getNode(node);
        if(!BLOCK_MAP.has(node.name)) {
            throw new Error(`Node is not a block: ${node.name}`);
        }
        return BLOCK_MAP.get(node.name);
    }

    getInput(node, key) {
        node = this.getNode(node);
        let block = this.getBlock(node);
        let prop = block.inputs?.find(prop => prop.key === key);
        if(!prop) {
            throw new Error(`Input not found on ${node.name}: ${key}`);
        }
        if(!getSocket(prop.type).data.reversed) {
            let input = this._input(node, key);
            if(prop.multi) {
                return this._sortConnections(input.connections, 'output').map(c => this._compileConnection(c, c.input, c.output, 'outputs'));
            }
            if(input.connections.length) {
                let c = input.connections[0];
                return this._compileConnection(c, c.input, c.output, 'outputs');
            }
            if(input.control) {
                return input.control.getValue();
            }
        }
        else {
            let output = this._output(node, key);
            if(prop.multi) {
                return this._sortConnections(output.connections, 'input').map(c => this._compileConnection(c, c.output, c.input, 'inputs'));
            }
            if(output.connections.length) {
                let c = output.connections[0];
                return this._compileConnection(c, c.output, c.input, 'inputs');
            }
        }
    }

    getControl(node, key) {
        node = this.getNode(node);
        return this._control(node, key).getValue();
    }

    _sortConnections(connections, sideKey) {
        return [...connections].sort((a, b) => a[sideKey].node.position[1] - b[sideKey].node.position[1]);
    }

    _compileConnection(connection, from, to) {
        let prop = this._getProp(to.node, 'outputs', to.key);
        if(!prop.compile) {
            throw new Error(`Cannot compile property of ${from.node.name} with key: ${prop.key}`);
        }
        return this.compile(to.node, to.key);
    }

    _getProp(node, listKey, key) {
        let block = this.getBlock(node);
        let prop = block[listKey]?.find(p => p.key === key);
        if(!prop) {
            throw new Error(`Prop does not exist in ${node.name} ${listKey}: ${key}`);
        }
        return prop;
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

    compile(id, key) {
        let node = this.getNode(id);
        let block = this.getBlock(node);
        let prop = block.outputs?.find(prop => prop.key === key);
        if(!prop) {
            throw new Error(`Output not found on ${node.name}: ${key}`);
        }
        let args = {};
        if(block.inputs) {
            for(let prop of block.inputs) {
                let value = this.getInput(node, prop.key);
                if(value === undefined && !prop.optional) {
                    console.warn('Missing input:', prop.key);
                    return;
                }
                args[prop.key] = value;
            }
        }
        if(block.controls) {
            for(let prop of block.controls) {
                let value = this.getControl(node, prop.key);
                if(value === undefined && !prop.optional) {
                    console.warn('Missing control value:', prop.key);
                    return;
                }
                args[prop.key] = value;
            }
        }
        return prop?.compile(args, this);
    }

    // _compile(functionName, id) {
    //     let node = this.getNode(id);
    //     if(!node.data.block?.compile) {
    //         throw new Error(`Cannot compile node: ${node.name}`);
    //     }
    //     return node.block[functionName](node, this);
    //     // return this._reduce(node, (n, data) => n.block.compile(data, n, this));
    // }

}