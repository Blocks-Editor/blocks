import Rete from 'rete';
import BaseComponent from './BaseComponent';
import DebugControl from '../controls/DebugControl';
import {anySocket} from '../sockets';

export default class DebugComponent extends BaseComponent {
    constructor() {
        super('Debug');
    }

    async builder(node) {
        node.addInput(new Rete.Input('input', 'Input', anySocket, false));
        node.addControl(new DebugControl(this.editor, 'debug'));
    }

    async worker(node, inputs, outputs, ...args) {
        outputs['debug'] = inputs['input'].length ? inputs['input'][0] : inputs.data['input'];
        // this.getControls(node).get('debug').putData('debug', outputs['debug']);//
    }
}
