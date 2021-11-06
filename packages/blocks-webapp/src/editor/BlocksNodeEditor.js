import Rete from 'rete';
import MotokoCompiler from '../compilers/MotokoCompiler';
import NodeCompiler from '../compilers/NodeCompiler';
import TypeCompiler from '../compilers/TypeCompiler';

export default class BlocksNodeEditor extends Rete.NodeEditor {
    constructor(...args) {
        super(...args);

        this.projectName = '';
        this.projectDescription = '';
        this.compilers = {
            type: new TypeCompiler(this),
            node: new NodeCompiler(this),
            motoko: new MotokoCompiler(this),
        };
    }

    // noinspection JSCheckFunctionSignatures
    toJSON() {
        let json = {
            name: this.projectName,
            description: this.projectDescription,
            version: this.id,
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
                });

            });
        }
        catch(e) {
            this.trigger('warn', e);
            hadError = true;
        }
        return this.afterImport() && !hadError;
    }
}