import {statementBlock} from '../block-patterns/statement-patterns';
import {boolType, effectType, optionalType, valueType} from '../block-types/types';
import {decompositionCategory} from '../block-categories/categories';
import nodeIdentifierRef from '../compilers/utils/nodeIdentifierRef';
import {FOR_ERROR_HANDLING} from '../editor/useCases';
import {formatOptionalParentheses, formatParentheses, formatStatementBlock} from '../editor/format/formatHelpers';

const block = statementBlock({
    title: 'Check Non-Null',
    info: 'Run different logic depending on whether an Optional value is null',
    useCases: [FOR_ERROR_HANDLING],
    category: decompositionCategory,
    inputs: [{
        key: 'input',
        type: optionalType,
    }, {
        key: 'valueCase',
        title: 'Has value',
        type: effectType,
        optional: true,
    }, {
        key: 'nullCase',
        title: 'Value is null',
        type: effectType,
        optional: true,
    }],
    outputs: [{
        key: 'condition',
        title: '!= null',
        type: boolType,
        toMotoko({input}, node) {
            return `${formatOptionalParentheses(nodeIdentifierRef(node))} != null`;
        },
    }, {
        key: 'value',
        type: valueType,
        inferType({input}) {
            if(optionalType.isSubtype(input)) {
                return input.generics[0];
            }
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