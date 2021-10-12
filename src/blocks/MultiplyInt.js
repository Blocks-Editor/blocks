import {binaryOperator} from '../block-patterns/operators';

const block = binaryOperator('Int', '*', (a, b) => a * b);
export default block;
