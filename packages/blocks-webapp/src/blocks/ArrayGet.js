import {arrayType, natType, valueType} from '../block-types/types';
import {collectionCategory} from '../block-categories/categories';
import {stateReadIcon} from './State';

const block = {
    title: 'Get (Array)',
    category: collectionCategory,
    icon: stateReadIcon,
    topRight: 'value',
    // deprecated: true,
    inputs: [{
        key: 'array',
        type: arrayType,
    }, {
        key: 'index',
        type: natType,
    }],
    outputs: [{
        key: 'value',
        type: valueType,
        inferType({array}) {
            if(arrayType.isSubtype(array)) {
                return array.generics[0];
            }
        },
        toMotoko({array, index}) {
            return `${array}[${index}]`;
        },
    }],
};
export default block;
