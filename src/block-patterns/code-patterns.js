import CodeControlHandle from '../components/rete/controls/CodeControlHandle';
import {anyType} from '../block-types/types';

let replaceRegex = /{([0-9]+)}/g;

export function expressionControl() {
    return {
        key: 'expression',
        config: {
            controlType: CodeControlHandle,
        },
    };
}

export function expressionArgsInput(type) {
    return {
        key: 'inputs',
        info: 'Reference inputs as {0}, {1}, {2}, ...',
        type: type || anyType,
        multi: true, // TODO: separate arg sockets
    };
}

export function parseCodeBlockInputs(inputs, expression) {
    return (expression || '').replace(replaceRegex, (match, i) => {
        i = +i;
        return i >= 0 && i < inputs.length ? inputs[i] : match;
    });
}
