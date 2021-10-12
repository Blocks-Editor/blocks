import {binaryOperator} from '../block-patterns/operators';
import {boolType} from '../block-types/types';

const block = binaryOperator(boolType, '||', (a, b) => a || b);
export default block;
