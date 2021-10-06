export default class Compiler {
    constructor(editor) {
        this.editor = editor;
    }

    getNode(id) {
        return typeof id === 'string' ? this.editor.nodes.find(node => node.id === id) : id;
    }

    getBlock(node) {
        if(!node.data.block) {
            throw new Error(`Node is not a block: ${node.name}`);
        }
        return node.data.block;
    }

    // TODO: dry all this
    getInput(node, key) {
        let input = this._input(node, key);
        let prop = this._getProp(node, 'inputs', key);
        if(input.multipleConnections) {
            return input.connections.map(c => this._compileConnection(c, prop));
        }
        if(input.connections.length) {
            return this._compileConnection(input.connections[0], prop);
        }
    }

    getOutput(node, key) {
        let output = this._output(node, key);
        let prop = this._getProp(node, 'outputs', key);
        if(output.multipleConnections) {
            return output.connections.map(c => this._compileConnection(c, prop));
        }
        if(output.connections.length) {
            return this._compileConnection(output.connections[0], prop);
        }
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
        return block.props[key];
    }

    _compileConnection(connection, prop) {
        if(!prop.compile) {
            throw new Error(`Cannot compile property with key: ${prop.key}`);
        }
    }

    _input(node, key) {
        if(!node.inputs.has(key)) {
            throw new Error(`Input not found: ${key}`);
        }
        return node.inputs.get(key);
    }

    _output(node, key) {
        if(!node.outputs.has(key)) {
            throw new Error(`Output not found: ${key}`);
        }
        return node.outputs.get(key);
    }

    _control(node, key) {
        if(!node.controls.has(key)) {
            throw new Error(`Control not found: ${key}`);
        }
        return node.controls.get(key);
    }

    _reduce(node, fn) {
        // TODO: dry
        let data = {};
        for(let input of node.inputs.values()) {
            let values = input.connections.map(c => this._reduce(c.output.node, fn));
            data[input.key] = input.multipleConnections ? values : values[0];
        }
        for(let output of node.outputs.values()) {
            let values = output.connections.map(c => this._reduce(c.input.node, fn));
            data[output.key] = output.multipleConnections ? values : values[0];
        }
        for(let control of node.controls.values()) {
            data[control.key] = control.getValue();
        }
        return fn(node, data);
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