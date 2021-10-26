import {effectType, unitType, valueType} from '../block-types/types';
import {endStatementBlock} from '../block-patterns/statement-patterns';

const block = endStatementBlock({
    inputs: [{
        key: 'value',
        type: valueType,
        optional: true,
    }],
}, {
    inferType({value}) {
        return effectType.of(value || unitType);
    },
    toMotoko({value}) {
        return `return${value ? ' ' + value : ''};`;
    },
});
export default block;