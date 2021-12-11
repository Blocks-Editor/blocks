import Rete from 'rete';
import {getType} from '../../block-types/types';

export default class PropSocket extends Rete.Socket {
    constructor(title, prop) {
        const type = getType(prop.type);
        super(title, {...type.data, type});

        this.prop = prop;
    }

    findProp() {
        return this.prop;
    }

    findLabel() {
        let type = this.findType();
        // let typeString = type.toTypeString();
        // return this.name === typeString ? this.name : `${this.name} (${typeString})`;

        const text = type.toTypeString();
        return type.data.info ? `${text} : ${type.data.info}` : text;
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