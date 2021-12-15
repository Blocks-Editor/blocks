import {statementBlock} from '../block-patterns/statement-patterns';
import {identifierType, valueType} from '../block-types/types';
import {paramCategory} from '../block-categories/categories';
import nodeIdentifierRef from '../compilers/utils/nodeIdentifierRef';
import {FOR_REUSABLE_LOGIC} from '../editor/useCases';

const block = statementBlock({
    title: 'Local Variable',
    info: 'Store and retrieve data from within a function',
    useCases: [FOR_REUSABLE_LOGIC],
    category: paramCategory,
    inputs: [{
        key: 'name',
        type: identifierType,
        optional: true,
    }, {
        key: 'initialValue',
        type: valueType,
    }],
    outputs: [{
        key: 'value',
        type: valueType,
        inferType({initialValue}) {
            return initialValue;
        },
        toMotoko({name}, node) {
            return name || nodeIdentifierRef(node);
        },
    }],
}, ({name, initialValue}, node) => {
    return `var ${name || nodeIdentifierRef(node)} = ${initialValue};`;
});
export default block;