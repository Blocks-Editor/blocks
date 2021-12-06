import Rete from 'rete';
import {getType} from '../../block-types/types';

export default class TypeSocket extends Rete.Socket {
    constructor(title, type) {
        type = getType(type);
        super(title, {...type.data, type});
    }

    findLabel() {
        let type = this.findType();
        // let typeString = type.toTypeString();
        // return this.name === typeString ? this.name : `${this.name} (${typeString})`;
        return type.toTypeString();
    }

    findType() {
        return this.data.type;
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