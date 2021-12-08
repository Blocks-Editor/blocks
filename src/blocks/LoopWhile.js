import {statementBlock} from '../block-patterns/statement-patterns';
import {boolType, effectType, unitType} from '../block-types/types';

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
    return `while (${condition}) { ${loop ?? ''} };`;
});
export default block;