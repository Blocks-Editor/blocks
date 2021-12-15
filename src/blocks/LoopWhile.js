import {statementBlock} from '../block-patterns/statement-patterns';
import {boolType, effectType, unitType} from '../block-types/types';
import {formatParentheses, formatStatementBlock} from '../editor/format/formatHelpers';

const block = statementBlock({
    title: 'while() {}',
    info: 'Repeat while the condition is true',
    inputs: [{
        key: 'condition',
        type: boolType,
    }, {
        key: 'loop',
        type: effectType.of(unitType),
        optional: true,
    }],
}, ({condition, loop}) => {
    return [
        'while',
        formatParentheses(condition),
        formatStatementBlock(loop ?? ''),
    ];
});
export default block;