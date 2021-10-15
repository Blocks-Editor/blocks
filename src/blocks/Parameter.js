import {identifierType, paramType, typeType, valueType} from '../block-types/types';

const block = {
    topLeft: 'param',
    // topRight: 'value',
    inputs: [{
        key: 'name',
        type: identifierType,
    }, {
        key: 'type',
        type: typeType.of(valueType),
    }],
    outputs: [{
        key: 'param',
        type: paramType,
        compile({name, type}, node, compiler) {
            // console.log(type)//
            let typeString = compiler.getTypeString(type) || '?';
            return `${name}: ${typeString}`;
        },
    }, {
        key: 'value',
        type: valueType,
        compile({name}) {
            return name;
        },
        inferType({type}) {
            return type;
        },
    }],
};
export default block;