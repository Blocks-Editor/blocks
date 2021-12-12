import Rete from 'rete';
import PropControl from '../controls/PropControl';
import PropSocket from '../sockets/PropSocket';
import PropOutputSocket from '../sockets/PropOutputSocket';
import {sentenceCase} from 'change-case';
import getPropLabel from '../../utils/getPropLabel';

export default class BlockComponent extends Rete.Component {

    constructor(block) {
        super(block.name);

        this.block = block;
        this.keywords = [
            ...sentenceCase(block.name).toLowerCase().split(' ').filter(s => s),
            ...block.title?.split(' ').filter(s => s) || [],
            ...block.keywords || [],
        ];
    }

    getEditorNode(node) {
        return this.editor.nodes.find(n => n.id === node.id);
    }

    getControls(node) {
        return this.getEditorNode(node).controls;
    }

    async builder(node) {
        // noinspection JSCheckFunctionSignatures
        this.editor.trigger('prenodecreate', node, this);

        const addProp = (prop, isPropOutput) => {
            let title = getPropLabel(prop);
            let socket = isPropOutput ? new PropOutputSocket(node, title, prop, this.editor.compilers.type) : new PropSocket(title, prop);
            if(!!prop.type.data.reversed === isPropOutput) {
                return addPropInput(prop, socket, isPropOutput);
            }
            else {
                return addPropOutput(prop, socket, isPropOutput);
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
            return prop.control || (!!socket.data.reversed === isOutput && socket.data.controlType && !prop.multi);
        };

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

        // // Advanced mode control if relevant
        // if(this.block.props.find(prop => prop.advanced)) {
        //     node.addControl(new BaseControl(this.editor, 'editor:advanced', 'Advanced', {
        //         controlType: CheckboxControlHandle,
        //     }));
        // }
    }
}
