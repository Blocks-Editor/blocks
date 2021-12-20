import {getType} from '../block-types/types';

export default function flattenUniqueTypes(type, array = []) {
    type = getType(type);
    const {generics} = type;
    while(type.parent && type.name === type.parent.name) {
        type = type.parent;
    }
    if(!array.includes(type)) {
        array.push(type);
    }
    for(const generic of generics) {
        flattenUniqueTypes(generic, array);
    }
    return array;
}
