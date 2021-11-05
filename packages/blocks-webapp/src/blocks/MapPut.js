import {mapType, valueType} from '../block-types/types';

const block = {
    title: 'Map: Get',
    // category: mapCategory,
    topRight: 'value',
    inputs: [{
        key: 'map',
        type: mapType,
    }, {
        key: 'key',
        type: valueType,
    }],
    outputs: [{
        key: 'value',
        type: mapType,
        inferType({map}) {
            if(mapType.isSubtype(map)) {
                return map.generics[1];
            }
        },
        toMotoko({map, key}) {
            return `${map}.get(${key})`;
        },
    }],
};
export default block;
