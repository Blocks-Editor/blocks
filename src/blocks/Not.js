import {unaryOperatorBlock} from '../block-patterns/operator-patterns';
import {boolType} from '../block-types/types';

const block = unaryOperatorBlock(boolType, '!', (a) => !a);
export default block;
