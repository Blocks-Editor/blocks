import {literalBlock} from '../block-patterns/literal-patterns';
import {floatType} from '../block-types/types';

const block = literalBlock({
    title: 'Float',
}, floatType);
export default block;