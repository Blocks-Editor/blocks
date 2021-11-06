import {arrayType, valueType} from '../block-types/types';
import {statementBlock} from '../block-patterns/statement-patterns';
import {collectionCategory} from '../block-categories/categories';
import {stateWriteIcon} from './State';
import {arrayImportRef} from './NewArray';

const block = statementBlock({
    title: 'Append (Array)',
    category: collectionCategory,
    icon: stateWriteIcon,
    inputs: [{
        key: 'array',
        title: 'Array',
        type: arrayType,
    }, {
        key: 'value',
        type: valueType,
    }],
}, ({array, value}) => {
    return `${array} := ${arrayImportRef}.append([${value}], ${array});`;
});
export default block;
