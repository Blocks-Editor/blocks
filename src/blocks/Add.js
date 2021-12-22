import {arithmeticOperatorBlock} from '../block-patterns/operator-patterns';

const block = {
    ...arithmeticOperatorBlock('+', (a, b) => a + b),
    info: 'Add two numbers',
};
export default block;
