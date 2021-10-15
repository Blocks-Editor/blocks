import {effectType, identifierType, memberType, paramType, valueType} from '../block-types/types';

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
    }/*, {
        key: 'returnType',
        type: typeType.of(valueType),
    }*/, {
        key: 'body',
        type: effectType,
    }],
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
            let bodyType = compiler.inferType(node, 'body');
            if(!bodyType) {
                return;
            }
            let returnType = compiler.getTypeString(bodyType.generics[0]) || '?';
            return `func${name ? ' ' + name : ''}(${params.join(', ')})${returnType !== '()' ? ': ' + returnType : ''} {${body}}`;
        },
    }],
};
export default block;

