import Rete from 'rete';
import {getSocket} from '../sockets';
import TypeControl from '../controls/TypeControl';
import BaseComponent from './BaseComponent';
import getDefaultLabel from '../../utils/getDefaultLabel';
import BaseControl from '../controls/BaseControl';

export default class BlockComponent extends BaseComponent {

    constructor(block) {
        super(block.name);

        this.block = block;
    }

    async builder(node) {

        if(this.block.title) {
            node.data.title = this.block.title;
        }

        const addProp = (prop, isOutput) => {
            let socket = getSocket(prop.type);
            if(!!socket.data.reversed === isOutput) {
                return addPropInput(prop, socket, isOutput);
            }
            else {
                return addPropOutput(prop, socket, isOutput);
            }
        };

        const addPropInput = (prop, socket, isOutput) => {
            let input = new Rete.Input(prop.key, prop.title || getDefaultLabel(prop.key), socket, isOutput || prop.multi);
            if(hasPropControl(prop, socket, isOutput)) {
                input.addControl(new TypeControl(this.editor, prop.key, socket));
            }
            node.addInput(input);
            return input;
        };

        const addPropOutput = (prop, socket, isOutput) => {
            let output = new Rete.Output(prop.key, prop.title || getDefaultLabel(prop.key), socket, !isOutput || prop.multi);
            node.addOutput(output);
            if(hasPropControl(prop, socket, isOutput)) {
                node.addControl(new TypeControl(this.editor, prop.key, socket));
            }
            return output;
        };

        const hasPropControl = (prop, socket, isOutput) => {
            return prop.control || (!!socket.data.reversed === isOutput && socket.data.controlType);
        };

        if(this.block.inputs) {
            for(let prop of this.block.inputs) {
                let io = addProp(prop, false);
                io._prop = prop; /////
            }
        }

        if(this.block.outputs) {
            for(let prop of this.block.outputs) {
                let io = addProp(prop, true);
                io._prop = prop; /////
            }
        }

        if(this.block.controls) {
            for(let prop of this.block.controls) {
                let control;
                if(prop.type) {
                    let socket = getSocket(prop.type);

                    control = new TypeControl(this.editor, prop.key, socket);
                }
                else {
                    control = new BaseControl(this.editor, prop.key, prop.config || {});
                }
                node.addControl(control);
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