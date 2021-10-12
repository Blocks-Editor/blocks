import {binaryOperator} from '../block-patterns/operators';

const block = binaryOperator('Bool', '||', (a, b) => a || b);
export default block;
