import {binaryOperatorBlock} from '../block-patterns/operator-patterns';
import {boolType, valueType} from '../block-types/types';

const block = {
    ...binaryOperatorBlock([valueType, boolType], '!=', (a, b) => a !== b),
    info: 'Check if two values are non-equal',
};
export default block;
