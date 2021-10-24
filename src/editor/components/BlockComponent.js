import Rete from 'rete';
import PropControl from '../controls/PropControl';
import BaseComponent from './BaseComponent';
import TypeSocket from '../sockets/TypeSocket';
import {sentenceCase} from 'change-case';
import getPropLabel from '../../utils/getPropLabel';

export default class BlockComponent extends BaseComponent {

    constructor(block) {
        super(block.name);

        this.block = block;
        this.keywords = [
            ...sentenceCase(block.name).toLowerCase().split(' ').filter(s => s),
            ...block.title?.split(' ').filter(s => s) || [],
            ...block.keywords || [],
        ];
    }

    async builder(node) {

        const addProp = (prop, isOutput) => {
            let socket = new TypeSocket(prop.type);
            if(!!prop.type.data.reversed === isOutput) {
                return addPropInput(prop, socket, isOutput);
            }
            else {
                return addPropOutput(prop, socket, isOutput);
            }
        };

        const addPropInput = (prop, socket, isOutput) => {
            let title = getPropLabel(prop);
            let input = new Rete.Input(prop.key, title, socket, prop.type.data.reversed || !!prop.multi);
            if(shouldPropHaveControl(prop, socket, isOutput)) {
                input.addControl(new PropControl(this.editor, prop, title));
            }
            node.addInput(input);
            return input;
        };

        const addPropOutput = (prop, socket, isOutput) => {
            let title = getPropLabel(prop);
            let output = new Rete.Output(prop.key, title, socket, !prop.type.data.reversed || !!prop.multi);
            node.addOutput(output);
            if(shouldPropHaveControl(prop, socket, isOutput)) {
                node.addControl(new PropControl(this.editor, prop, title));
            }
            return output;
        };

        const shouldPropHaveControl = (prop, socket, isOutput) => {
            return prop.control || (!!socket.data.reversed === isOutput && socket.data.controlType);
        };

        if(this.block.title) {
            node.meta.title = this.block.title;
        }
        else {
            delete node.meta.title;
        }

        for(let prop of this.block.inputs) {
            addProp(prop, false);
        }
        for(let prop of this.block.outputs) {
            addProp(prop, true);
        }

        for(let prop of this.block.controls) {
            let title = getPropLabel(prop);
            node.addControl(new PropControl(this.editor, prop, title));
        }

        // this.block.builder?.apply(this, arguments);
    }

    // async worker(node, inputs, outputs, ...args) {
    //     await this.block.worker?.apply(this, arguments);
    // }
}