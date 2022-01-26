import {arrayType, valueType} from '../block-types/types';
import {statementBlock} from '../block-patterns/statement-patterns';
import {collectionCategory} from '../block-categories/categories';
import {arrayImportRef} from './NewArray';
import {FaRegCaretSquareRight} from 'react-icons/fa';

const block = statementBlock({
    title: 'Append (Array)',
    info: 'Add an item to the end of an array',
    category: collectionCategory,
    icon: FaRegCaretSquareRight,
    inputs: [{
        key: 'array',
        title: 'Array',
        type: arrayType,
    }, {
        key: 'value',
        type: valueType,
    }],
}, ({array, value}) => {
    return `${array} := ${arrayImportRef}.append(${array}, [${value}]);`;
});
export default block;
