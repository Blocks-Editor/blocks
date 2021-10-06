import Rete from 'rete';
import {getSocket} from '../sockets';
import TypeControl from '../controls/TypeControl';
import BaseComponent from './BaseComponent';

export default class BlockComponent extends BaseComponent {

    constructor(name, block) {
        super(name);

        this.block = block;
    }

    async builder(node) {
        // if(this.block.props) {
        //     for(let [key, prop] of Object.entries(this.block.props)) {
        //         let socket = getSocket(prop.type);
        //
        //         if(prop.input) {
        //             node.addInput(new Rete.Input(key, key, socket, false));
        //         }
        //         if(prop.output) {
        //             node.addOutput(new Rete.Output(key, key, socket, true));
        //         }
        //         if(prop.control) {
        //             node.addControl(new TypeControl(this.editor, key, socket));
        //         }
        //     }
        // }

        // TODO: dry

        if(this.block.inputs) {
            for(let prop of this.block.inputs) {
                let socket = getSocket(prop.type);

                node.addInput(new Rete.Input(prop.key, prop.key, socket, false));
            }
        }

        if(this.block.outputs) {
            for(let prop of this.block.outputs) {
                let socket = getSocket(prop.type);

                node.addOutput(new Rete.Output(prop.key, prop.key, socket, true));
                if(prop.control) {
                    node.addControl(new TypeControl(this.editor, prop.key, socket));
                }
            }
        }

        if(this.block.controls) {
            for(let prop of this.block.controls) {
                let socket = getSocket(prop.type);

                node.addControl(new TypeControl(this.editor, prop.key, socket));
            }
        }

        if(this.block.builder) {
            this.block.builder.apply(this, arguments);
        }
    }

    async worker(node, inputs, outputs, ...args) {
        // let n1 = inputs['num'].length ? inputs['num'][0] : node.data.num1;
        // let n2 = inputs['num2'].length ? inputs['num2'][0] : node.data.num2;
        // let sum = n1 + n2;
        //
        // this.editor.nodes.find(n => n.id === node.id).controls.get('preview').setValue(sum);
        // outputs['num'] = sum;

        // if(this.block.controls) {
        //     for(let [key, control] of this.getControls(node).entries()) {
        //         outputs[key] = control.getValue();
        //     }
        // }

        if(this.block.worker) {
            await this.block.worker.apply(this, arguments);
        }

        // console.log('Node:', this.getEditorNode(node));///
    }
}