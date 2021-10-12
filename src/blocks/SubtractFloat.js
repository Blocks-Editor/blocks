import {binaryOperator} from '../block-patterns/operators';

const block = binaryOperator('Float', '-', (a, b) => a - b);
export default block;
