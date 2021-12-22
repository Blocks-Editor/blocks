import {binaryOperatorBlock} from '../block-patterns/operator-patterns';
import {textType} from '../block-types/types';

const block = {
    ...binaryOperatorBlock(textType, '#', (a, b) => a || b),
    info: 'Concatenate text values',
};
export default block;
