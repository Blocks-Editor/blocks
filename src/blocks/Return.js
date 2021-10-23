import {effectType, unitType, valueType} from '../block-types/types';

const block = {
    topLeft: 'statement',
    inputs: [{
        key: 'value',
        type: valueType,
        optional: true,
    }],
    outputs: [{
        key: 'statement',
        type: effectType,
        toMotoko({value}) {
            return `return${value ? ' ' + value : ''};`;
        },
        inferType({value}) {
            return effectType.of(value || unitType);
        },
    }],
};
export default block;