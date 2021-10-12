import {unaryOperator} from '../block-patterns/operators';

const block = unaryOperator('Bool', '!', (a) => !a);
export default block;
