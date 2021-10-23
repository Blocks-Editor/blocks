import Rete from 'rete';
import Compiler from './utils/Compiler';
import {getType} from '../block-types/types';

export default class BlocksNodeEditor extends Rete.NodeEditor {
    constructor(...args) {
        super(...args);

        this.compilers = {
            type: new Compiler(this, 'inferType', {
                defaultCompile: (prop) => getType(prop.type),
                postCompile(type) {
                    if(type) {
                        type = getType(type);
                        if(type.isAbstract()) {
                            throw new Error(`Abstract inferred type: ${type.toTypeString()}`);
                        }
                    }
                    return type;
                },
            }),
            motoko: new Compiler(this, 'toMotoko', {
                postCompile: (result) => Array.isArray(result) ? result.join(' ') : result,///
            }),
        };
    }

    async fromJSON(json) {
        if(!this.beforeImport(json)) {
            return false;
        }
        let hadError = false;
        try {
            const nodes = {};
            await Promise.all(Object.entries(json.nodes).map(async ([id, node]) => {
                try {
                    const component = this.getComponent(node.name);

                    nodes[id] = await component.build(Rete.Node.fromJSON(node));
                    this.addNode(nodes[id]);
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