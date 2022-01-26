import Rete from 'rete';
import {getType} from '../../block-types/types';
import flattenUniqueTypes from '../../utils/flattenUniqueTypes';

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
        const type = this.findType();
        // const label = getPropLabel(this.prop);

        // let text = this.prop.info ? `${label} : ${getInfoText(this.prop.info)}` : label;
        let text = '';
        for(const relevant of flattenUniqueTypes(type)) {
            if(!relevant.data.abstract) {
                const info = relevant.meta.info || relevant.data.info;
                if(info) {
                    if(text) {
                        text += '<br>';
                    }
                    text += `${relevant.toTypeString()} : ${info}`;
                }
            }
        }
        return text;
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