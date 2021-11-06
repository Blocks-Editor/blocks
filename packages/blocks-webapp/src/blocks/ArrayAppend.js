import {arrayType, valueType} from '../block-types/types';
import {statementBlock} from '../block-patterns/statement-patterns';
import {collectionCategory} from '../block-categories/categories';
import {stateWriteIcon} from './State';
import {arrayImportRef} from './NewMutableArray';

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
    return `${array} := ${arrayImportRef}.append(${array}, ${value});`;
});
export default block;
