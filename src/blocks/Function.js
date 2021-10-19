import {boolType, effectType, identifierType, paramType, unitType, valueType} from '../block-types/types';
import {memberBlock} from '../block-patterns/member-patterns';
import {functionCategory} from '../block-categories/categories';
import {stringSelectProp} from '../block-patterns/control-patterns';

const defaultReturnType = effectType.of(unitType);

const block = memberBlock({
    // topLeft: 'member',
    topRight: 'body',
    category: functionCategory,
    computeTitle(node, editor) {
        let {name, params} = editor.compilers.motoko.getInputArgs(node) || {};
        let {body} = editor.compilers.type.getInputArgs(node) || {};
        let returnType = body?.generics[0];
        return name && params && `${name}(${params.join(', ')})${returnType ? ': ' + editor.compilers.motoko.getTypeString(returnType) : ''}`;
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
        optional: true,
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

        let returnType = body ? compiler.inferType(node, 'body') : defaultReturnType;
        if(!returnType) {
            return;
        }
        let returnString = compiler.getTypeString(returnType.generics[0]);
        if(!returnString) {
            return;///
        }
        if(asyncType) {
            returnString = `async ${returnString}`;
        }
        return `${modifiers && modifiers + ' '}func${name ? ' ' + name : ''}(${params.join(', ')})${returnString !== '()' ? ': ' + returnString : ''} {${body || ''}};`;
    },
});
export default block;
