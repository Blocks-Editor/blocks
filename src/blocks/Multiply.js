import {arithmeticOperatorBlock} from '../block-patterns/operator-patterns';

const block = {
    ...arithmeticOperatorBlock('*', (a, b) => a * b),
    info: 'Multiply two numbers',
};
export default block;