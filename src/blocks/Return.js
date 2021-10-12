import {effectType, valueType} from '../block-types/types';

const block = {
    topLeft: 'statement',
    inputs: [{
        key: 'value',
        type: valueType,
    }],
    outputs: [{
        key: 'statement',
        type: effectType,
        compile({value}) {
            return `return ${value};`;
        },
        inferType({value}) {
            return effectType.of(value);
        },
    }],
};
export default block;