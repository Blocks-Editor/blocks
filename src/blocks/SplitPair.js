import {decompositionCategory} from '../block-categories/categories';
import {tupleType, valueType} from '../block-types/types';
import {formatParentheses} from '../editor/format/formatHelpers';

const block = {
    info: 'Access the left and right elements of a pair',
    category: decompositionCategory,
    inputs: [{
        key: 'value',
        title: 'Pair',
        type: tupleType.of([valueType, valueType]),
    }],
    outputs: [{
        key: 'left',
        inferType({value}) {
            if(value) {
                return value.generics[0];
            }
        },
        toMotoko({value}) {
            return `${formatParentheses(value)}.0`;
        },
    }, {
        key: 'right',
        inferType({value}) {
            if(value) {
                return value.generics[1];
            }
        },
        toMotoko({value}) {
            return `${formatParentheses(value)}.1`;
        },
    }],
};
export default block;
