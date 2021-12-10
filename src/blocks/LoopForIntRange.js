import {statementBlock} from '../block-patterns/statement-patterns';
import {boolType, effectType, intType, unitType} from '../block-types/types';
import {importRef, nodeIdentifierRef} from '../compilers/MotokoCompiler';

export const iterImportRef = importRef('mo:base/Iter');

const block = statementBlock({
    title: 'for(min..max) {}',
    info: 'Repeat for a range of integers (inclusive)',
    inputs: [{
        key: 'min',
        type: intType,
    }, {
        key: 'max',
        type: intType,
    }, {
        key: 'loop',
        type: effectType.of(unitType),
    }],
    outputs: [{
        key: 'item',
        type: intType,
        toMotoko(_, node) {
            return nodeIdentifierRef(node);
        },
    }],
    controls: [{
        key: 'inclusive',
        type: boolType,
    }],
}, ({min, max, loop, inclusive}, node) => {
    return `for (${nodeIdentifierRef(node)} in ${iterImportRef}.range(${min}, ${inclusive ? max : `(${max}) - 1`})) { ${loop ?? ''} };`;
});
export default block;