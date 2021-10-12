import {binaryOperator} from '../block-patterns/operators';
import {floatType} from '../block-types/types';

const block = binaryOperator(floatType, '*', (a, b) => a * b);
export default block;