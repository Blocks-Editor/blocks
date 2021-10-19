import {anyReversedType, anyType} from '../block-types/types';
import OutputControlHandle from '../components/rete/controls/OutputControlHandle';

export function compileBlock(name, compilerKey, displayFn) {
    function onUpdateBuilder(inputKey) {
        return async function onUpdate(control, node, editor) {
            try {
                let value = editor.compilers[compilerKey].getInput(node, inputKey);
                control.setValue(displayFn ? displayFn(value) : value);
            }
            catch(err) {
                console.warn(err.stack || err);
                control.setValue(`<${err}>`);
            }
        };
    }

    return {
        title: `<${name}>`,
        topLeft: 'input',
        topRight: 'reversed',
        inputs: [{
            key: 'input',
            title: 'Input',
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
            onUpdate: onUpdateBuilder('reversed'),
        }, {
            key: 'display',
            config: {
                controlType: OutputControlHandle,
            },
            onUpdate: onUpdateBuilder('input'),
        }],
    };
}
