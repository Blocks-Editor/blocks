import Rete from 'rete';
import {getSocket} from '../sockets';
import TypeControl from '../controls/TypeControl';
import BaseComponent from './BaseComponent';
import getDefaultLabel from '../../utils/getDefaultLabel';

export default class BlockComponent extends BaseComponent {

    constructor(block) {
        super(block.name);

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

        if(this.block.title) {
            node.data.title = this.block.title;
        }

        // TODO: dry

        if(this.block.inputs) {
            for(let prop of this.block.inputs) {
                let socket = getSocket(prop.type);

                let input = new Rete.Input(prop.key, prop.title || getDefaultLabel(prop.key), socket, false);
                if(socket.data.controlType) {
                    input.addControl(new TypeControl(this.editor, prop.key, socket));
                }

                node.addInput(input);
            }
        }

        if(this.block.outputs) {
            for(let prop of this.block.outputs) {
                let socket = getSocket(prop.type);

                node.addOutput(new Rete.Output(prop.key, prop.title || getDefaultLabel(prop.key), socket, true));
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

        if(this.block.worker) {
            await this.block.worker.apply(this, arguments);
        }
    }
}