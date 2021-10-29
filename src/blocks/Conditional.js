import {statementBlock} from '../block-patterns/statement-patterns';
import {boolType, effectType} from '../block-types/types';

const block = statementBlock({
    title: 'if() then {} else {}',
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

    let falsePart = falseCase ? ` else { ${falseCase} }` : '';
    return `if(${condition}) { ${trueCase || ''} }${falsePart};`;
});
export default block;