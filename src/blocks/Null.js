import {optionalType, unitType, valueType} from '../block-types/types';
import {literalCategory} from '../block-categories/categories';

const block = {
    category: literalCategory,
    topRight: 'value',
    outputs: [{
        key: 'value',
        type: optionalType.of(unitType),// TODO: Option<*> or null type
        // inferType() {
        //     return ;
        // },
        toMotoko() {
            return `null`;
        },
    }],
};
export default block;
