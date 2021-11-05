import Rete from 'rete';

export default class NodeOutputSocket extends Rete.Socket {
    constructor(nodeId, key, typeCompiler, data) {
        super(`${nodeId}.${key}`, data);

        this.nodeId = nodeId;
        this.key = key;
        this.typeCompiler = typeCompiler;
    }

    findType() {
        let output = this.data.type;
        try {
            output = this.typeCompiler.getOutput(this.nodeId, this.key) || output;
        }
        catch(err) {
            // console.warning(err);
        }
        return;
    }

    compatibleWith(other) {
        if(!('findType' in other)) {
            return;
        }
        let reversed = !!this.data.reversed;
        if(reversed === !other.data.reversed) {
            return false;
        }
        let self = this;
        if(!reversed) {
            [self, other] = [other, self];
        }
        let selfType = self.findType();
        let otherType = other.findType();

        console.log(selfType, otherType);

        return selfType && selfType.isSubtype(otherType);
    }
}