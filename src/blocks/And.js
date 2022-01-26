import {logicalBinaryOperatorBlock} from '../block-patterns/operator-patterns';

const block = {
    ...logicalBinaryOperatorBlock('and', (a, b) => a && b),
    info: 'Return true if-and-only-if both arguments are true',
};
export default block;