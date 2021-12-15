import {getType} from '../block-types/types';

export default function flattenUniqueTypes(type, array = []) {
    type = getType(type);
    if(!array.includes(type)) {
        array.push(type);
    }
    for(const generic of type.generics) {
        flattenUniqueTypes(generic, array);
    }
    return array;
}
