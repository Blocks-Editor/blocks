import {boolType, effectType, identifierType, paramType, valueType} from '../block-types/types';
import {memberBlock} from '../block-patterns/member-patterns';

const block = memberBlock({
    // topLeft: 'member',
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
    }],
    controls: [{
        key: 'shared',
        type: boolType,
    }, {
        key: 'query',
        type: boolType,
    }, {
        key: 'async',
        type: boolType,
    }],
}, {
    compile({visibility, shared, stable, query, async, name, params, body}, node, compiler) {
        // TODO: dry
        let modifiers = [visibility, stable && 'stable', shared && 'shared', query && 'query'].filter(m => m).join(' '); //TODO: combine into single control

        let bodyType = compiler.inferType(node, 'body');
        if(!bodyType) {
            return;
        }
        let returnType = compiler.getTypeString(bodyType.generics[0]) || '()';
        if(async) {
            returnType = `async ${returnType}`;
        }
        return `${modifiers && modifiers + ' '}func${name ? ' ' + name : ''}(${params.join(', ')})${returnType !== '()' ? ': ' + returnType : ''} {${body}};`;
    },
});
export default block;
