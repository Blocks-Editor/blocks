import Rete from 'rete';
import TypeControl from '../controls/TypeControl';
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

        // noinspection JSUnresolvedVariable
        // let typeCompiler = this.editor.compilers.type;

        const addProp = (prop, isOutput) => {
            let type = getType(prop.type);
            let socket = /*isOutput ? new NodeOutputSocket(node.id, prop.key, typeCompiler, {
                ...type.data,
                type, /!*** TEMP ***!/
            }) : */ new TypeSocket(type);
            if(!!type.data.reversed === isOutput) {
                return addPropInput(prop, socket, isOutput);
            }
            else {
                return addPropOutput(prop, socket, isOutput);
            }
        };

        const addPropInput = (prop, socket, isOutput) => {
            let input = new Rete.Input(prop.key, prop.title || getDefaultLabel(prop.key), socket, isOutput === !!prop.multi);
            if(hasPropControl(prop, socket, isOutput)) {
                input.addControl(new TypeControl(this.editor, prop.key, socket));
            }
            node.addInput(input);
            return input;
        };

        const addPropOutput = (prop, socket, isOutput) => {
            let output = new Rete.Output(prop.key, prop.title || getDefaultLabel(prop.key), socket, isOutput === !prop.multi);
            node.addOutput(output);
            if(hasPropControl(prop, socket, isOutput)) {
                node.addControl(new TypeControl(this.editor, prop.key, socket));
            }
            return output;
        };

        const hasPropControl = (prop, socket, isOutput) => {
            return prop.control || (!!socket.data.reversed === isOutput && socket.data.controlType);
        };

        if(this.block.title) {
            node.data.title = this.block.title;
        }

        for(let prop of this.block.inputs) {
            let io = addProp(prop, false);
            io._prop = prop; /////
        }
        for(let prop of this.block.outputs) {
            let io = addProp(prop, true);
            io._prop = prop; /////
        }

        for(let prop of this.block.controls) {
            let control;
            if(prop.type) {
                let socket = new TypeSocket(prop.type);
                console.log(socket.type.toTypeString());

                control = new TypeControl(this.editor, prop.key, socket);
            }
            else {
                control = new BaseControl(this.editor, prop.key, prop.config || {});
            }
            node.addControl(control);
        }

        this.block.builder?.apply(this, arguments);
    }

    async worker(node, inputs, outputs, ...args) {

        await this.block.worker?.apply(this, arguments);
    }
}