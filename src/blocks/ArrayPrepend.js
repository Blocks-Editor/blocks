import {arrayType, valueType} from '../block-types/types';
import {statementBlock} from '../block-patterns/statement-patterns';
import {collectionCategory} from '../block-categories/categories';
import {arrayImportRef} from './NewArray';
import {FaRegCaretSquareLeft} from 'react-icons/fa';

const block = statementBlock({
    title: 'Prepend (Array)',
    category: collectionCategory,
    icon: FaRegCaretSquareLeft,
    inputs: [{
        key: 'array',
        title: 'Array',
        type: arrayType,
    }, {
        key: 'value',
        type: valueType,
    }],
}, ({array, value}) => {
    return `(${array} := ${arrayImportRef}.append([${value}], ${array}));`;
});
export default block;
