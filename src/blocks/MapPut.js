import {mapType, valueType} from '../block-types/types';
import {statementBlock} from '../block-patterns/statement-patterns';
import {collectionCategory} from '../block-categories/categories';
import {stateWriteIcon} from './State';

const block = statementBlock({
    title: 'Put (Map)',
    category: collectionCategory,
    icon: stateWriteIcon,
    // deprecated: true,
    inputs: [{
        key: 'map',
        type: mapType,
    }, {
        key: 'key',
        type: valueType,
    }, {
        key: 'value',
        type: valueType,
    }],
}, ({map, key, value}) => {
    return `${map}.put(${key}, ${value});`;
});
export default block;
