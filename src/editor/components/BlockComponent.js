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

        const addProp = (prop, isOutput) => {
            let socket = getSocket(prop.type);
            if(!!socket.data.reversed === isOutput) {
                addPropInput(prop, socket, isOutput);
            }
            else {
                addPropOutput(prop, socket, isOutput);
            }
        };

        const addPropInput = (prop, socket, isOutput) => {
            let input = new Rete.Input(prop.key, prop.title || getDefaultLabel(prop.key), socket, isOutput || prop.multi);
            if(hasPropControl(prop, socket, isOutput)) {
                input.addControl(new TypeControl(this.editor, prop.key, socket));
            }
            node.addInput(input);
        };

        const addPropOutput = (prop, socket, isOutput) => {
            node.addOutput(new Rete.Output(prop.key, prop.title || getDefaultLabel(prop.key), socket, !isOutput || prop.multi));
            if(hasPropControl(prop, socket, isOutput)) {
                node.addControl(new TypeControl(this.editor, prop.key, socket));
            }
        };

        const hasPropControl = (prop, socket, isOutput) => {
            return prop.control || (!!socket.data.reversed === isOutput && socket.data.controlType);
        };

        // TODO: dry

        if(this.block.inputs) {
            for(let prop of this.block.inputs) {
                addProp(prop, false);
            }
        }

        if(this.block.outputs) {
            for(let prop of this.block.outputs) {
                addProp(prop, true);
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