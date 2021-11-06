import {arrayType, natType, optionalType} from '../block-types/types';
import {collectionCategory} from '../block-categories/categories';
import {stateReadIcon} from './State';

const block = {
    title: 'Get (Array)',
    category: collectionCategory,
    icon: stateReadIcon,
    topRight: 'value',
    inputs: [{
        key: 'array',
        type: arrayType,
    }, {
        key: 'index',
        type: natType,
    }],
    outputs: [{
        key: 'value',
        type: optionalType,
        inferType({array}) {
            if(arrayType.isSubtype(array)) {
                return optionalType.of(array.generics[0]);
            }
        },
        toMotoko({array, key}) {
            return `${array}[${key}]`;
        },
    }],
};
export default block;
