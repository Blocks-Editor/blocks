import {anyType, typeType} from '../block-types/types';
import {codeCategory} from '../block-categories/categories';
import CodeControlHandle from '../components/rete/controls/CodeControlHandle';

let replaceRegex = /\{([0-9]+)}/g;


function parseInputs(inputs, expression) {
    return expression.replaceAll(replaceRegex, (match, i) => {
        i = +i;
        return i >= 0 && i < inputs.length ? inputs[i] : match;
    });
}

export function codeBlock(type, block) {

    return {
        category: codeCategory,
        icon: codeCategory.data.icon,
        topLeft: 'inputs',
        topRight: 'result',
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
                return parseInputs(inputs, expression);
            },
        }, ...block.outputs || []],
        controls: [{
            key: 'expression',
            controlType: CodeControlHandle,
        }, ...block.controls || []],
    };
}
