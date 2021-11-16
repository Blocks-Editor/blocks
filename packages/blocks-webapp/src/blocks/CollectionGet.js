import {collectionType, mapType, optionalType, valueType} from '../block-types/types';
import {collectionCategory} from '../block-categories/categories';
import {stateReadIcon} from './State';

const block = {
    title: 'Get (Collection)',
    category: collectionCategory,
    icon: stateReadIcon,
    topRight: 'value',
    hidden: true,
    inputs: [{
        key: 'collection',
        type: collectionType,
    }, {
        key: 'key',
        type: valueType,
    }],
    outputs: [{
        key: 'value',
        type: optionalType.of(valueType),
        inferType({collection}) {
            if(mapType.isSubtype(collection)) {
                return optionalType.of(collection.generics[1]);
            }
        },
        toMotoko({collection, key}) {
            return `${collection}.get(${key})`;
        },
    }],
};
export default block;
