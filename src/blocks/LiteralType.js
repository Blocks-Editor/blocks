import {literalBlock} from '../block-patterns/literal-patterns';
import {typeType, valueType} from '../block-types/types';
import {typeCategory} from '../block-categories/categories';

const block = literalBlock({
    title: 'Type',
    category: typeCategory,
}, typeType.of(valueType));
export default block;
