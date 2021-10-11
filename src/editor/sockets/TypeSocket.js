import Rete from 'rete';
import {getType} from '../../block-types/types';

export default class TypeSocket extends Rete.Socket {
    constructor(type) {
        type = getType(type);
        super(type.name, {...type.data, type});
    }

    setType(type) {
        this.data.type = type;
    }

    compatibleWith(socket) {
        if(!socket.data.type) {
            return false;
        }
        let reversed = !!this.data.reversed;
        if(reversed === !socket.data.reversed) {
            return false;
        }
        let self = this;
        if(reversed) {
            [self, socket] = [socket, self];
        }
        // return (self.name === socket.name) /*super.compatibleWith(socket)*/ || (!!self.data.parent && self.data.parent.compatibleWith(socket));
        return self.data.type.isAssignableFrom(socket.data.type);
    }
}