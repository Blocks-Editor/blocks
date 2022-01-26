import {logicalBinaryOperatorBlock} from '../block-patterns/operator-patterns';

const block = {
    ...logicalBinaryOperatorBlock('or', (a, b) => a || b),
    info: 'Return true if either of the input values are true',
};
export default block;
