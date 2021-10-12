import {effectType, identifierType, memberType, paramType, unitType, valueType} from '../block-types/types';

const block = {
    topLeft: 'member',
    topRight: 'body',
    inputs: [{
        key: 'name',
        type: identifierType,
    }, {
        key: 'params',
        type: paramType,
        multi: true,
    }, {
        key: 'body',
        type: effectType,
    }/*, {
        key: 'returnType',
        type: typeType,
    }*/],
    outputs: [{
        key: 'reference',
        type: valueType,
        compile({name}) {
            return name;
        },
    }, {
        key: 'member',
        type: memberType,
        compile({name, params, body}, node, compiler) {
            let returnType = compiler.inferType(node, 'body') || '?';
            return `func${name ? ' ' + name : ''}(${params.join(', ')})${unitType.isSubtype(returnType) ? ': ' + returnType : ''} {${body}}`;
        },
    }],
};
export default block;

