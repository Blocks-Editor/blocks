import {arithmeticOperatorBlock} from '../block-patterns/operator-patterns';

const block = {
    ...arithmeticOperatorBlock('/', (a, b) => a / b),
    info: 'Divide one number by the other',
};
export default block;