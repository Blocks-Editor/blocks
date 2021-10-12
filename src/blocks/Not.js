import {unaryOperator} from '../block-patterns/operators';
import {boolType} from '../block-types/types';

const block = unaryOperator(boolType, '!', (a) => !a);
export default block;
