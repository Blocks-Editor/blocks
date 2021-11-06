import {anyType, typeType} from '../block-types/types';
import {expressionCategory} from '../block-categories/categories';
import CodeControlHandle from '../components/rete/controls/CodeControlHandle';

let replaceRegex = /{([0-9]+)}/g;


export function parseCodeBlockInputs(inputs, expression) {
    return (expression || '').replaceAll(replaceRegex, (match, i) => {
        i = +i;
        return i >= 0 && i < inputs.length ? inputs[i] : match;
    });
}

export function codeBlock(name, type, block = {}) {
    return {
        title: `{${name}}`,
        info: `Compile an arbitrary ${name} expression`,
        category: expressionCategory,
        icon: expressionCategory.data.icon,
        // topLeft: 'inputs',
        topRight: 'result',
        className: 'node-wide',
        ...block,
        inputs: [{
            key: 'inputs',
            type: anyType,
            multi: true,
        }, {
            key: 'type',
            type: typeType.of(type),
        }, ...block.inputs || []],
        outputs: [{
            key: 'result',
            type,
            inferType({type}) {
                // return parseInputs(inputs, typeCode);
                return type;
            },
            toMotoko({inputs, expression}) {
                return parseCodeBlockInputs(inputs, expression);
            },
        }, ...block.outputs || []],
        controls: [{
            key: 'expression',
            config: {
                controlType: CodeControlHandle,
            },
        }, ...block.controls || []],
    };
}
