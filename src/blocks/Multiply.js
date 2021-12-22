import {binaryOperatorBlock} from '../block-patterns/operator-patterns';
import {floatType} from '../block-types/types';

const block = {
    ...binaryOperatorBlock(floatType, '*', (a, b) => a * b),
    info: 'Multiply two numbers',
};
export default block;