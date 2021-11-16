import {asyncType, boolType, paramType, principalType, unitType, valueType} from '../block-types/types';
import {computeMemberName, memberBlock, visibilityControlProp} from '../block-patterns/member-patterns';
import {functionCategory} from '../block-categories/categories';
import {nodeIdentifierRef} from '../compilers/MotokoCompiler';

// TODO: TEMPORARY: experimental

const defaultReturnType = unitType;

export function getQueryReturnType(node, editor) {
    let type = editor.compilers.type.getInput(node, 'body') || defaultReturnType;
    let visibility = editor.compilers.control.getInput(node, 'visibility');
    if(visibility === 'public') {
        type = asyncType.of(type);
    }
    return type;
}

const block = memberBlock({
    info: 'Return a value',
    category: functionCategory,
    topRight: 'body',
    global: true,
    computeTitle(node, editor) {
        let name = computeMemberName(node, editor);
        // return name;/////
        let {params, body} = editor.compilers.motoko.getInputArgs(node);
        let returnType = getQueryReturnType(node, editor);
        if(!name && !params.length && !body) {
            return;
        }
        return `${name || ''}(${params.join(', ')})${returnType ? ' : ' + editor.compilers.motoko.getTypeString(returnType) : ''}`;
    },
    shortcuts: [{
        block: 'FunctionCall',
        nodeKey: 'functionNode',
    }, {
        block: 'Return',
        connections: [{
            from: 'body',
            to: 'statement',
        }],
    }],
    inputs: [{
        key: 'params',
        type: paramType,
        multi: true,
    }, {
        key: 'body',
        type: valueType,
        optional: true,
    }],
    outputs: [{
        key: 'caller',
        type: principalType,
        toMotoko(args, node, compiler) {
            return `${nodeIdentifierRef(node)}.caller`;
        },
    }],
    controls: [
        visibilityControlProp(), {
            key: 'query',
            type: boolType,
        }],
}, {
    toMotoko({name, visibility, params, body}, node, compiler) {
        let hasCaller = node.outputs.get('caller').connections.length;

        let shared = !!hasCaller;
        let modifiers = [visibility !== 'system' && visibility, shared && 'shared'].filter(m => m).join(' ');

        let returnType = getQueryReturnType(node, compiler.editor);
        let returnString = compiler.getTypeString(returnType);
        return [
            modifiers,
            hasCaller ? nodeIdentifierRef(node) : '',
            `query func ${name || ''}(${params.join(', ')})${returnString !== '()' ? ` : ${returnString}` : ''}`,
            `{ ${body || ''} };`,
        ];
    },
});
export default block;
