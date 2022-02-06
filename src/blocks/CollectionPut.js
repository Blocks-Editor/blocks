import {collectionType, valueType} from '../block-types/types';
import {statementBlock} from '../block-patterns/statement-patterns';
import {collectionCategory} from '../block-categories/categories';
import {stateWriteIcon} from './State';

const block = statementBlock({
    info: 'Update an item corresponding to the given key',
    title: 'Put (Collection)',
    category: collectionCategory,
    icon: stateWriteIcon,
    hidden: true,
    inputs: [{
        key: 'collection',
        type: collectionType,
    }, {
        key: 'key',
        type: valueType,
    }, {
        key: 'value',
        type: valueType,
    }],
}, ({collection, key, value}) => {
    return `${collection}.put(${key}, ${value});`;
});
export default block;
