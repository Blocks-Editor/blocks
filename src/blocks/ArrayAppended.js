import {arrayType, valueType} from '../block-types/types';
import {collectionCategory} from '../block-categories/categories';
import {stateWriteIcon} from './State';
import {arrayImportRef} from './NewArray';

const block = {
    title: 'Appended (Array)',
    info: 'Return an array with an item added to the end',
    category: collectionCategory,
    icon: stateWriteIcon,
    topRight: 'result',
    hidden: true,///
    inputs: [{
        key: 'array',
        type: arrayType,
    }, {
        key: 'item',
        type: valueType,
    }],
    outputs: [{
        key: 'result',
        type: valueType,
        inferType({array}) {
            if(arrayType.isSubtype(array)) {
                return array.generics[0];
            }
        },
        toMotoko({array, item}) {
            return `${arrayImportRef}.append(${array}, ${item});`;
        },
    }],
};
export default block;
