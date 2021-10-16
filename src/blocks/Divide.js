import {binaryOperatorBlock} from '../block-patterns/operator-patterns';
import {floatType} from '../block-types/types';

const block = binaryOperatorBlock(floatType, '/', (a, b) => a / b);
export default block;