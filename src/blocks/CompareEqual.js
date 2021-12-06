import {binaryOperatorBlock} from '../block-patterns/operator-patterns';
import {boolType, valueType} from '../block-types/types';

const block = binaryOperatorBlock([valueType, boolType], '==', (a, b) => a === b);
export default block;
