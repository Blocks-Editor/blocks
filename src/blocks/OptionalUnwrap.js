import {statementBlock} from '../block-patterns/statement-patterns';
import {effectType, optionalType, valueType} from '../block-types/types';
import {decompositionCategory} from '../block-categories/categories';
import nodeIdentifierRef from '../compilers/utils/nodeIdentifierRef';
import {FOR_ERROR_HANDLING} from '../editor/useCases';
import {formatParentheses, formatStatementBlock} from '../editor/format/formatHelpers';

const block = statementBlock({
    title: 'Unwrap Optional',
    info: 'Run different logic depending on whether an Optional value is null',
    useCases: [FOR_ERROR_HANDLING],
    category: decompositionCategory,
    inputs: [{
        key: 'input',
        type: optionalType,
    }, {
        key: 'valueCase',
        title: 'Value',
        type: effectType,
        optional: true,
    }, {
        key: 'nullCase',
        title: 'Null',
        type: effectType,
        optional: true,
    }],
    outputs: [{
        key: 'value',
        type: valueType,
        inferType({input}) {
            return input;
        },
        toMotoko({input}, node) {
            return nodeIdentifierRef(node);
        },
    }],
}, ({input, valueCase, nullCase}, node) => {
    if(String(input) === 'null') {
        return nullCase;
    }

    let valuePart = valueCase ? `case (?${nodeIdentifierRef(node)}) {${valueCase}};` : '';
    let nullPart = nullCase ? `case null {${nullCase}};` : '';

    return [
        'switch',
        formatParentheses(input),
        formatStatementBlock(`${valuePart}${nullPart && ' ' + nullPart}`),
    ];
});
export default block;