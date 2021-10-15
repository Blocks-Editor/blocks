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
        if(!other.data.type) {
            return false;
        }
        // let reversed = !!this.data.reversed;
        // if(reversed === !other.data.reversed) {
        //     return false;
        // }
        // let self = this;
        // if(!reversed) {
        //     [self, other] = [other, self];
        // }
        // let selfType = self.data.type;
        // let otherType = other.data.type;
        //
        // return selfType.isSubtype(otherType);

        return this.data.type.isSubtype(other.data.type) || other.data.type.isSubtype(this.data.type);
    }
}