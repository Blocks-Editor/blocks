import Rete from 'rete';
import MotokoCompiler from '../compilers/MotokoCompiler';
import NodeCompiler from '../compilers/NodeCompiler';
import TypeCompiler from '../compilers/TypeCompiler';
import ControlCompiler from '../compilers/ControlCompiler';
import compileGlobalMotoko from '../compilers/utils/compileGlobalMotoko';

// Custom Rete.js node editor implementation

export default class BlocksNodeEditor extends Rete.NodeEditor {
    constructor(...args) {
        super(...args);

        this.projectName = '';
        this.projectDescription = '';
        this.compilers = {
            control: new ControlCompiler(this),
            node: new NodeCompiler(this),
            type: new TypeCompiler(this),
            motoko: new MotokoCompiler(this),
        };

        // Called before node creation
        this.bind('prenodecreate');

        // Clear all event listeners after destroy
        this.on('destroy', () => {
            setTimeout(() => {
                for(let array of Object.values(this.events)) {
                    array.length = 0;
                }
            });
        });
    }

    off(event, listener) {
        const events = this.events[event];
        if(!events) {
            return;
        }
        const index = events.indexOf(listener);
        if(index !== -1) {
            events.splice(index, 1);
        }
    }

    // noinspection JSCheckFunctionSignatures
    toJSON() {
        const language = 'motoko';
        let output;
        try {
            // TODO: optimize / refactor?
            output = compileGlobalMotoko(this);
        }
        catch(err) {
            console.warn(`Error while compiling before save: ${err}`);
            // console.warn(err);
        }

        let json = {
            name: this.projectName,
            description: this.projectDescription,
            version: this.id,
            language,
            output: output || null,
            ...super.toJSON(),
        };
        delete json.id;
        // noinspection JSValidateTypes
        return json;
    }

    async fromJSON(json) {
        // noinspection JSUnresolvedVariable
        json = {id: json.version, ...json};

        if(!this.beforeImport(json)) {
            return false;
        }

        // TODO: refactor serialization
        this.projectName = json.name || '';
        this.projectDescription = json.description || '';

        let hadError = false;
        try {
            const nodes = {};
            await Promise.all(Object.entries(json.nodes).map(async ([id, jsonNode]) => {
                try {
                    const component = this.getComponent(jsonNode.name);
                    const node = await component.build(Rete.Node.fromJSON(jsonNode));
                    nodes[id] = node;
                    this.addNode(node);
                }
                catch(e) {
                    hadError = true;
                    return this.trigger('error', e);
                }
            }));

            Object.entries(json.nodes).forEach(([id, jsonNode]) => {
                const node = nodes[id];

                Object.entries(jsonNode.outputs).forEach(([key, jsonOutput]) => {
                    try {
                        jsonOutput.connections.forEach(jsonConnection => {
                            const nodeId = jsonConnection.node;
                            const data = jsonConnection.data;
                            const targetOutput = node.outputs.get(key);
                            const otherNode = nodes[nodeId];
                            if(!otherNode) {
                                hadError = true;
                                return this.trigger('error', `Tried to connect to unknown node ${node.id}`);
                            }
                            const targetInput = otherNode.inputs.get(jsonConnection.input);

                            if(!targetOutput || !targetInput) {
                                hadError = true;
                                return this.trigger('error', `IO not found for node ${node.id}`);
                            }

                            this.connect(targetOutput, targetInput, data);
                        });
                    }
                    catch(e) {
                        hadError = true;
                        return this.trigger('error', e);
                    }
                });
            });
        }
        catch(e) {
            this.trigger('warn', e);
            hadError = true;
        }
        return this.afterImport() && !hadError;
    }

    async createNode(component, data = {}, position = null) {
        let node = await component.createNode(data);
        if(position) {
            let {x, y} = position;
            [node.position[0], node.position[1]] = [x, y];
        }
        this.addNode(node);
        return node;
    }

    async createNodeAtCursor(component, data = {}) {
        let {x, y} = this.view.area.mouse;
        return this.createNode(component, data, {x: x - 80, y: y - 20});
    }

    updateNode(node) {
        node.update();
        setTimeout(() => {
            for(const io of [...node.inputs.values(), ...node.outputs.values()]) {
                for(const conn of io.connections) {
                    this.view.connections.get(conn)?.update();
                }
            }
        });
    }

    connect(output, input, data) {
        if(output.node && output.node === input.node) {
            return;
        }
        super.connect(output, input, data);
    }
}
