import {binaryOperator} from '../block-patterns/operators';
import {intType} from '../block-types/types';

const block = binaryOperator(intType, '/', (a, b) => Math.floor(a / b));
export default block;
