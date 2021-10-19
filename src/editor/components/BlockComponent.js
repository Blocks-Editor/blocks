import Rete from 'rete';
import PropControl from '../controls/PropControl';
import BaseComponent from './BaseComponent';
import getDefaultLabel from '../../utils/getDefaultLabel';
import BaseControl from '../controls/BaseControl';
import TypeSocket from '../sockets/TypeSocket';
import {getType} from '../../block-types/types';
import {sentenceCase} from 'change-case';

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
            let title = prop.title || getDefaultLabel(prop.key);
            let input = new Rete.Input(prop.key, title, socket, !isOutput === !!prop.type.data.reversed || !!prop.multi);
            if(shouldHavePropControl(prop, socket, isOutput)) {
                input.addControl(new PropControl(this.editor, prop, title, socket));
            }
            node.addInput(input);
            return input;
        };

        const addPropOutput = (prop, socket, isOutput) => {
            let title = prop.title || getDefaultLabel(prop.key);
            let output = new Rete.Output(prop.key, title, socket, isOutput === !!prop.type.data.reversed || !!prop.multi);
            node.addOutput(output);
            if(shouldHavePropControl(prop, socket, isOutput)) {
                node.addControl(new PropControl(this.editor, prop, title, socket));
            }
            return output;
        };

        const shouldHavePropControl = (prop, socket, isOutput) => {
            return prop.control || (!!socket.data.reversed === isOutput && socket.data.controlType);
        };

        if(this.block.title) {
            node.data.title = this.block.title;
        }

        for(let prop of this.block.inputs) {
            addProp(prop, false);
        }
        for(let prop of this.block.outputs) {
            addProp(prop, true);
        }

        for(let prop of this.block.controls) {
            let title = prop.title || getDefaultLabel(prop.key);
            let control;
            if(prop.type) {
                let socket = new TypeSocket(prop.type);
                control = new PropControl(this.editor, prop, title, socket);
            }
            else {
                control = new BaseControl(this.editor, prop.key, title, prop.config || {});
            }
            node.addControl(control);
        }

        this.block.builder?.apply(this, arguments);
    }

    async worker(node, inputs, outputs, ...args) {

        await this.block.worker?.apply(this, arguments);
    }
}