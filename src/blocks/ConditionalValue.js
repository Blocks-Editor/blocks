import {boolType, valueType} from '../block-types/types';
import {decompositionCategory} from '../block-categories/categories';
import {formatCurlyBraces, formatParentheses} from '../editor/format/formatHelpers';

const block = {
    title: 'Map Bool',
    category: decompositionCategory,
    topLeft: 'condition',
    topRight: 'result',
    inputs: [{
        key: 'condition',
        type: boolType,
    }, {
        key: 'trueCase',
        type: valueType,
    }, {
        key: 'falseCase',
        type: valueType,
    }],
    outputs: [{
        key: 'result',
        type: valueType,
        inferType({trueCase, falseCase}) {
            return trueCase.getSharedType(falseCase);
        },
        toMotoko({condition, trueCase, falseCase}) {
            if(condition === true) {
                return trueCase;
            }
            else if(condition === false) {
                return falseCase;
            }
            return formatParentheses(`if ${formatParentheses(condition)} ${formatCurlyBraces(trueCase)} else ${formatCurlyBraces(falseCase)}`);
        },
    }],
};
export default block;
