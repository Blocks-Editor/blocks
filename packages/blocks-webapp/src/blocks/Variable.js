import {statementBlock} from '../block-patterns/statement-patterns';
import {identifierType, valueType} from '../block-types/types';
import {paramCategory} from '../block-categories/categories';

const block = statementBlock({
    title: 'Local Variable',
    info: 'Store and retrieve data from within a function',
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
            return name || `var__${node.id}`;
        },
    }],
}, ({name, initialValue}, node) => {
    return `var ${name || `var__${node.id}`} = ${initialValue};`;
});
export default block;