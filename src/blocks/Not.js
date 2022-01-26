import {unaryOperatorBlock} from '../block-patterns/operator-patterns';
import {boolType} from '../block-types/types';

const block = {
    ...unaryOperatorBlock(boolType, 'not', (a) => !a),
    info: 'Logically invert the value (swap true with false and vice versa)',
};
export default block;
