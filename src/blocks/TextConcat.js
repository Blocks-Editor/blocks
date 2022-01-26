import {binaryOperatorBlock} from '../block-patterns/operator-patterns';
import {textType} from '../block-types/types';

const block = {
    ...binaryOperatorBlock(textType, '#', (a, b) => a || b),
    title: 'Concatenate (Text)',
    info: 'Add text values directly one after each other',
};
export default block;
