import {parseCodeBlockInputs} from '../block-patterns/code-patterns';
import {anyType, typeType, valueType} from '../block-types/types';
import {expressionCategory} from '../block-categories/categories';
import CodeControlHandle from '../components/rete/controls/CodeControlHandle';

const block = {
    title: `{ Expression }`,
    info: `Compile an arbitrary expression`,
    category: expressionCategory,
    icon: expressionCategory.data.icon,
    // topLeft: 'inputs',
    topRight: 'result',
    width: 14,
    inputs: [{
        key: 'inputs',
        type: anyType,
        multi: true,
    }, {
        key: 'type',
        type: typeType.of(valueType),
    }],
    outputs: [{
        key: 'result',
        type: valueType,
        inferType({type}) {
            // return parseInputs(inputs, typeCode);
            return type;
        },
        toMotoko({inputs, expression}) {
            return `do { ${parseCodeBlockInputs(inputs, expression)} }`;
        },
    }],
    controls: [{
        key: 'expression',
        config: {
            controlType: CodeControlHandle,
        },
    }],
};
export default block;
