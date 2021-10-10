import OutputControlHandle from '../components/rete/controls/OutputControlHandle';
import Compiler from '../editor/utils/Compiler';

const block = {
    inputs: [{
        key: 'input',
        type: 'Any',
    }, {
        key: 'reversed',
        title: 'Input',
        type: 'AnyReversed',
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
        let compiler = new Compiler(this.editor);

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