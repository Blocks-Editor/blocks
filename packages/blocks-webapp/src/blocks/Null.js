import {nullType} from '../block-types/types';
import {literalCategory} from '../block-categories/categories';

const block = {
    category: literalCategory,
    topRight: 'value',
    outputs: [{
        key: 'value',
        type: nullType,
        toMotoko() {
            return `null`;
        },
    }],
};
export default block;
