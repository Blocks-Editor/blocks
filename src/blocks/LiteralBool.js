import {literalBlock} from '../block-patterns/literal-patterns';
import {boolType} from '../block-types/types';

const block = literalBlock({
    title: 'Boolean',
}, boolType);
export default block;