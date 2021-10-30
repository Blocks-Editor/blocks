import Rete from 'rete';
import Compiler from './utils/Compiler';
import {getType} from '../block-types/types';

export default class BlocksNodeEditor extends Rete.NodeEditor {
    constructor(...args) {
        super(...args);

        this.compilers = {
            type: new Compiler(this, 'inferType', {
                defaultCompile: (prop) => getType(prop.type),
                postCompile(type, node, key) {
                    if(type) {
                        type = getType(type);
                        if(type.isAbstract()) {
                            console.warn(`[${node.name}.${key}]`, 'Abstract inferred type:', type.toTypeString());
                            // return;
                        }
                    }
                    return type;
                },
            }),
            node: new Compiler(this, 'toNode', {
                defaultCompile: (prop, node) => node,
                postCompile(result) {
                    if(!result) {
                        return;
                    }
                    let id = String(result.id);
                    return this.editor.nodes.find(n => String(n.id) === id);
                },
            }),
            motoko: new Compiler(this, 'toMotoko', {
                postCompile: (result) => {
                    if(Array.isArray(result)) {
                        return result.filter(s => s).join(' ');
                    }
                    if(typeof result === 'string') {
                        return result;
                    }
                    if(typeof result === 'number' || typeof result === 'boolean') {
                        return result.toString();
                    }
                    if(result === undefined) {
                        return;
                    }
                    console.warn('Unexpected Motoko expression:', result);
                    return String(result);
                },///
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