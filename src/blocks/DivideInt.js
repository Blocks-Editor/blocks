import {binaryOperator} from '../block-patterns/members';

const block = binaryOperator('Int', '/', (a, b) => Math.floor(a / b));
export default block;
