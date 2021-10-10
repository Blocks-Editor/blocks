import {unaryOperator} from '../block-patterns/members';

const block = unaryOperator('Bool', '!', (a) => !a);
export default block;
