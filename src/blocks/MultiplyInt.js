import {binaryOperator} from '../block-patterns/members';

const block = binaryOperator('Int', '*', (a, b) => a * b);
export default block;
