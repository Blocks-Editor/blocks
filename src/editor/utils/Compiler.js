import {BLOCK_MAP} from '../blocks';
import Rete from 'rete';

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

    // TODO: dry all this
    getInput(node, key) {
        node = this.getNode(node);
        let input = this._input(node, key);
        if(input.multipleConnections) {
            return input.connections.map(c => this._compileConnection(c, c.input, c.output, 'outputs'));
        }
        if(input.connections.length) {
            let c = input.connections[0];
            return this._compileConnection(c, c.input, c.output, 'outputs');
        }
    }

    getOutput(node, key) {
        node = this.getNode(node);
        let output = this._output(node, key);
        if(output.multipleConnections) {
            return output.connections.map(c => this._compileConnection(c, c.output, c.input, 'inputs'));
        }
        if(output.connections.length) {
            let c = output.connections[0];
            return this._compileConnection(c, c.output, c.input, 'inputs');
        }
    }

    getControl(node, key) {
        node = this.getNode(node);
        return this._control(node, key).getValue();
    }

    _getProp(node, list, key) {
        let block = this.getBlock(node);
        if(!block.hasOwnProperty(list)) {
            throw new Error(`${node.name} does not have ${list}, searching for '${key}'`);
        }
        let prop = block[list].find(p => p.key === key);
        if(!prop) {
            throw new Error(`Prop does not exist on ${node.name}: ${key}`);
        }
        return prop;
    }

    _compileConnection(connection, from, to, list) {
        let prop = this._getProp(to.node, list, to.name);
        if(!prop.compile) {
            throw new Error(`Cannot compile property of ${from.node.name} with key: ${prop.key}`);
        }
        return prop.compile(to.node, this);
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

    // _reduce(node, fn) {
    //     // TODO: dry
    //     let data = {};
    //     for(let input of node.inputs.values()) {
    //         let values = input.connections.map(c => this._reduce(c.output.node, fn));
    //         data[input.key] = input.multipleConnections ? values : values[0];
    //     }
    //     for(let output of node.outputs.values()) {
    //         let values = output.connections.map(c => this._reduce(c.input.node, fn));
    //         data[output.key] = output.multipleConnections ? values : values[0];
    //     }
    //     for(let control of node.controls.values()) {
    //         data[control.key] = control.getValue();
    //     }
    //     return fn(node, data);
    // }

    // _compile(functionName, id) {
    //     let node = this.getNode(id);
    //     if(!node.data.block?.compile) {
    //         throw new Error(`Cannot compile node: ${node.name}`);
    //     }
    //     return node.block[functionName](node, this);
    //     // return this._reduce(node, (n, data) => n.block.compile(data, n, this));
    // }

}