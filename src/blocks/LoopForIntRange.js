import {statementBlock} from '../block-patterns/statement-patterns';
import {effectType, intType, unitType} from '../block-types/types';
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
    // controls:[{
    //    key:'name',
    //    type:identifierType,
    //    optional:true,
    // }],
}, ({min, max, loop}, node) => {
    return `for (${nodeIdentifierRef(node)} in ${iterImportRef}.range(${min}, ${max})) { ${loop ?? ''} };`;
});
export default block;