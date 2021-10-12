import OutputControlHandle from '../components/rete/controls/OutputControlHandle';
import Compiler from '../editor/utils/Compiler';
import {anyReversedType, anyType} from '../block-types/types';

const block = {
    topLeft: 'input',
    topRight: 'reversed',
    inputs: [{
        key: 'input',
        type: anyType,
    }, {
        key: 'reversed',
        title: 'Input',
        type: anyReversedType,
    }],
    controls: [{
        key: 'reversedDisplay',
        title: 'Display',
        config: {
            controlType: OutputControlHandle,
        },
    }, {
        key: 'display',
        config: {
            controlType: OutputControlHandle,
        },
    }],
    // async builder(node) {
    // },
    async worker(node, inputs, outputs, ...args) {
        let compiler = new Compiler(this.editor, 'compile');

        let controls = this.getControls(node);

        let display = controls.get('display');
        let displayValue = compiler.getInput(node, 'input');
        display.setValue(displayValue);

        let reversed = controls.get('reversedDisplay');
        let reversedValue = compiler.getInput(node, 'reversed');
        reversed.setValue(reversedValue);
    },
};
export default block;