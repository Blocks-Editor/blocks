import {binaryOperator} from '../block-patterns/operators';

const block = binaryOperator('Int', '/', (a, b) => Math.floor(a / b));
export default block;
