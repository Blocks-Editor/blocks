import {binaryOperatorBlock} from '../block-patterns/operator-patterns';
import {boolType} from '../block-types/types';

const block = binaryOperatorBlock(boolType, 'or', (a, b) => a || b);
export default block;
