import {binaryOperatorBlock} from '../block-patterns/operator-patterns';
import {intType} from '../block-types/types';

const block = binaryOperatorBlock(intType, '/', (a, b) => Math.floor(a / b));
export default block;
