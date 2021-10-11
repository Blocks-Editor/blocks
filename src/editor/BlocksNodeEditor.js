import Rete from 'rete';
import Compiler from './utils/Compiler';
import {getType} from '../block-types/types';

export default class BlocksNodeEditor extends Rete.NodeEditor {
    constructor(...args) {
        super(...args);

        this.compilers = {
            motoko: new Compiler(this, 'compile'),
            type: new Compiler(this, 'inferType', (prop) => getType(prop.type)),
        };
    }


    async fromJSON(json) {
        if(!this.beforeImport(json)) return false;
        const nodes = {};

        try {
            await Promise.all(Object.entries(json.nodes).map(async ([id, node]) => {
                try {
                    const component = this.getComponent(node.name);

                    nodes[id] = await component.build(Rete.Node.fromJSON(node));
                    this.addNode(nodes[id]);
                }
                catch(e) {
                    // console.error(`Unable to load node: ${node.name}`, e.stack || e);
                    this.trigger('warn', e);
                }
            }));

            Object.entries(json.nodes).forEach(([id, jsonNode]) => {
                const node = nodes[id];

                Object.entries(jsonNode.outputs).forEach(([key, jsonOutput]) => {

                    jsonOutput.connections.forEach(jsonConnection => {
                        const nodeId = jsonConnection.node;
                        const data = jsonConnection.data;
                        const targetOutput = node.outputs.get(key);
                        const targetInput = nodes[nodeId].inputs.get(jsonConnection.input);

                        if(!targetOutput || !targetInput) {
                            return this.trigger('error', `IO not found for node ${node.id}`);
                        }

                        this.connect(targetOutput, targetInput, data);
                    });
                });

            });
        }
        catch(e) {
            this.trigger('warn', e);
            return !this.afterImport();
        }

        return this.afterImport();
    }
}