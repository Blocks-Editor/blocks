import {boolType, effectType, identifierType, paramType, valueType} from '../block-types/types';
import {memberBlock} from '../block-patterns/member-patterns';
import {functionCategory} from '../block-categories/categories';
import {stringSelectProp} from '../block-patterns/control-patterns';

const block = memberBlock({
    // topLeft: 'member',
    topRight: 'body',
    category: functionCategory,
    computeTitle(node, editor) {
        let {name, params} = editor.compilers.motoko.getInputArgs(node) || {};
        let {body} = editor.compilers.type.getInputArgs(node) || {};
        let returnType = body?.generics[0];
        return name && params && body && body.generics[0] && `${name}(${params.join(', ')})${returnType ? ': ' + editor.compilers.motoko.getTypeString(returnType) : ''}`;
    },
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
    }, stringSelectProp({
        key: 'asyncType',
        optional: true,
    }, ['async', 'query'])],
}, {
    compile({visibility, shared, stable, asyncType, name, params, body}, node, compiler) {
        // TODO: dry with Field
        let modifiers = [visibility, stable && 'stable', shared && 'shared', asyncType === 'query' && asyncType].filter(m => m).join(' '); //TODO: combine into single control

        let bodyType = compiler.inferType(node, 'body');
        if(!bodyType) {
            return;
        }
        let returnType = compiler.getTypeString(bodyType.generics[0]) || '()';
        if(asyncType) {
            returnType = `async ${returnType}`;
        }
        return `${modifiers && modifiers + ' '}func${name ? ' ' + name : ''}(${params.join(', ')})${returnType !== '()' ? ': ' + returnType : ''} {${body}};`;
    },
});
export default block;
