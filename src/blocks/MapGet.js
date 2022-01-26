import {mapType, optionalType, valueType} from '../block-types/types';
import {collectionCategory} from '../block-categories/categories';
import {stateReadIcon} from './State';

const block = {
    title: 'Get (Map)',
    info: 'Find the value corresponding to a given key, returning null if nothing is found',
    category: collectionCategory,
    icon: stateReadIcon,
    topRight: 'value',
    // deprecated: true,
    inputs: [{
        key: 'map',
        type: mapType,
    }, {
        key: 'key',
        type: valueType,
    }],
    outputs: [{
        key: 'value',
        type: optionalType.of(valueType),
        inferType({map}) {
            if(mapType.isSubtype(map)) {
                return optionalType.of(map.generics[1]);
            }
        },
        toMotoko({map, key}) {
            return `${map}.get(${key})`;
        },
    }],
};
export default block;
