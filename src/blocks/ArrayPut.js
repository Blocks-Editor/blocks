import {mutableArrayType, natType, valueType} from '../block-types/types';
import {statementBlock} from '../block-patterns/statement-patterns';
import {collectionCategory} from '../block-categories/categories';
import {stateWriteIcon} from './State';

const block = statementBlock({
    title: 'Put (Array)',
    info: 'Set the item at a specific index',
    category: collectionCategory,
    icon: stateWriteIcon,
    // deprecated: true,
    inputs: [{
        key: 'array',
        title: 'Array (mutable)',
        type: mutableArrayType,
    }, {
        key: 'index',
        type: natType,
    }, {
        key: 'value',
        type: valueType,
    }],
}, ({array, index, value}) => {
    return `${array}.put(${index}, ${value});`;
});
export default block;
