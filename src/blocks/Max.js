import {operatorCategory} from '../block-categories/categories';
import {formatCurlyBraces, formatParentheses} from '../editor/format/formatHelpers';
import {floatType} from '../block-types/types';

const block = {
    title: 'Maximum',
    info: 'Find the maximum of two numbers',
    category: operatorCategory,
    topRight: 'result',
    inputs: [{
        key: 'left',
        title: 'a',
        type: floatType,
    }, {
        key: 'right',
        title: 'b',
        type: floatType,
    }],
    outputs: [{
        key: 'result',
        type: floatType,
        toMotoko({left, right}) {
            return formatParentheses([
                'if',
                formatParentheses(`${left} > ${right}`),
                formatCurlyBraces(left),
                'else',
                formatCurlyBraces(right),
            ]);
        },
        // inferType({left, right}) {
        //     return left.getSharedType(right);
        // },
    }],
};
export default block;
