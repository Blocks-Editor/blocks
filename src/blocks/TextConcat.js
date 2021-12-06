import {binaryOperatorBlock} from '../block-patterns/operator-patterns';
import {textType} from '../block-types/types';

const block = binaryOperatorBlock(textType, '#', (a, b) => a || b);
export default block;
