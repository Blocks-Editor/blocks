import {effectType, unitType, valueType} from '../block-types/types';
import {effectCategory} from '../block-categories/categories';

const block = {
    category: effectCategory,
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