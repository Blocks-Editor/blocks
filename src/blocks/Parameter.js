import {identifierType, paramType, typeType, valueType} from '../block-types/types';

const block = {
    topLeft: 'param',
    // topRight: 'value',
    inputs: [{
        key: 'name',
        type: identifierType,
    }],
    outputs: [{
        key: 'param',
        type: paramType,
        toMotoko({name, type}, node, compiler) {
            // console.log(type)//
            let typeString = compiler.getTypeString(type) || '??';
            return `${name}: ${typeString}`;
        },
    }, {
        key: 'value',
        type: valueType,
        toMotoko({name}) {
            return name;
        },
        inferType({type}) {
            return type;
        },
    }],
    controls: [{
        key: 'type',
        type: typeType.of(valueType),
    }],
};
export default block;