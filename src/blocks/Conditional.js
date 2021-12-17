import {statementBlock} from '../block-patterns/statement-patterns';
import {boolType, effectType} from '../block-types/types';
import {formatCurlyBraces, formatParentheses} from '../editor/format/formatHelpers';

const block = statementBlock({
    title: 'if() then {} else {}',
    info: 'Evaluate based on a given condition',
    inputs: [{
        key: 'condition',
        type: boolType,
    }, {
        key: 'trueCase',
        title: 'True',
        type: effectType,
        optional: true,
    }, {
        key: 'falseCase',
        title: 'False',
        type: effectType,
        optional: true,
    }],
}, ({condition, trueCase, falseCase}) => {
    if(String(condition) === 'true') {
        return trueCase;
    }
    if(String(condition) === 'false') {
        return falseCase;
    }

    let falsePart = falseCase ? ['else', formatCurlyBraces(falseCase)] : '';
    return [
        'if',
        formatParentheses(condition),
        formatCurlyBraces(trueCase || ''),
        falsePart,
    ];
});
export default block;