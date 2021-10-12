import {binaryOperator} from '../block-patterns/operators';
import {intType} from '../block-types/types';

const block = binaryOperator(intType, '-', (a, b) => a - b);
export default block;
