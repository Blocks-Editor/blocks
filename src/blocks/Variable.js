import {statementBlock} from '../block-patterns/statement-patterns';
import {identifierType, valueType} from '../block-types/types';
import {paramCategory} from '../block-categories/categories';

const block = statementBlock({
    title: 'Local Variable',
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
            return name || `__${node.id}`;
        },
    }],
}, ({name, initialValue}, node) => {
    return `var ${name || `__${node.id}`} = ${initialValue};`;
});
export default block;