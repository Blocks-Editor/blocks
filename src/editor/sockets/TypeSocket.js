import Rete from 'rete';
import {getType} from '../../block-types/types';

export default class TypeSocket extends Rete.Socket {
    constructor(type) {
        type = getType(type);
        super(type.name, {...type.data, type});
    }

    findType() {
        return this.data.type;
    }

    setType(type) {
        this.data.type = type;
    }

    compatibleWith(other) {
        if(!('findType' in other)) {
            return false;
        }
        let type = this.findType();
        let otherType = other.findType();

        return type.isSubtype(otherType) || otherType.isSubtype(type);
    }
}