import {binaryOperator} from '../block-patterns/members';

const block = binaryOperator('Bool', '&&', (a, b) => a && b);
export default block;