import {anyReversedType, anyType} from '../block-types/types';
import OutputControlHandle from '../components/rete/controls/OutputControlHandle';

export function compileBlock(title, compilerKey) {
    return {
        title,
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
            let compiler = this.editor.compilers[compilerKey];

            let controls = this.getControls(node);

            let display = controls.get('display');
            try {
                let displayValue = compiler.getInput(node, 'input');
                display.setValue(displayValue);
            }
            catch(err) {
                console.warn(err.stack || err);
                display.setValue(`<${err}>`);
            }

            let reversed = controls.get('reversedDisplay');
            try {
                let reversedValue = compiler.getInput(node, 'reversed');
                reversed.setValue(reversedValue);
            }
            catch(err) {
                console.warn(err.stack || err);
                reversed.setValue(`<${err}>`);
            }
        },
    };
}