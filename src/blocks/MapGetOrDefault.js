import {mapType, optionalType, valueType} from '../block-types/types';
import {collectionCategory} from '../block-categories/categories';
import {stateReadIcon} from './State';
import {optionImportRef} from './OptionalOrDefault';

const block = {
    title: 'Get or Default (Map)',
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
    }, {
        key: 'defaultValue',
        title: 'Default',
        type: valueType,
    }],
    outputs: [{
        key: 'value',
        type: optionalType.of(valueType),
        inferType({map}) {
            if(mapType.isSubtype(map)) {
                return map.generics[1];
            }
        },
        toMotoko({map, key, defaultValue}) {
            return `${optionImportRef}.get(${map}.get(${key}), ${defaultValue})`;
        },
    }],
};
export default block;
