import {binaryOperator} from '../block-patterns/members';

const block = binaryOperator('Float', '/', (a, b) => a / b);
export default block;