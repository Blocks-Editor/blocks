import {asyncType, boolType, effectType, paramType, principalType, unitType} from '../block-types/types';
import {computeMemberName, memberBlock, visibilityControlProp} from '../block-patterns/member-patterns';
import {functionCategory} from '../block-categories/categories';
import {nodeIdentifierRef} from '../compilers/MotokoCompiler';

const defaultReturnType = unitType;

export function getFunctionReturnType(node, editor) {
    let type = editor.compilers.type.getInput(node, 'body')?.generics[0] || defaultReturnType;
    let query = editor.compilers.control.getInput(node, 'query');
    let visibility = editor.compilers.control.getInput(node, 'visibility');
    if(query || visibility === 'public') {
        type = asyncType.of(type);
    }
    return type;
}

const block = memberBlock({
    info: 'Evaluate based on given input parameters',
    category: functionCategory,
    topRight: 'body',
    global: true,
    computeTitle(node, editor) {
        let name = computeMemberName(node, editor);
        // return name;/////
        let {params, body} = editor.compilers.motoko.getInputArgs(node);
        let returnType = getFunctionReturnType(node, editor);
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
        type: effectType,
        optional: true,
    }],
    outputs: [{
        //     key: 'reference',
        //     type: referenceType,
        //     toMotoko({name}) {
        //         return name;
        //     },
        // }, {
        key: 'caller',
        type: principalType,
        toMotoko(args, node, compiler) {
            return `${nodeIdentifierRef(node)}.caller`;
        },
    }],
    controls: [/*{
        key: 'shared',
        type: boolType,
    },*/ /*stringSelectProp({
        key: 'asyncKind',
        optional: true,
    }, ['async', 'query']),*/
        visibilityControlProp(), {
            key: 'query',
            type: boolType,
        }],
}, {
    toMotoko({name, visibility, query, params, body}, node, compiler) {
        let hasCaller = node.outputs.get('caller').connections.length;

        let shared = !!hasCaller;
        let modifiers = [visibility !== 'system' && visibility, shared && 'shared'].filter(m => m).join(' ');

        let returnType = getFunctionReturnType(node, compiler.editor);
        let returnString = compiler.getTypeString(returnType);
        return [
            modifiers,
            hasCaller ? nodeIdentifierRef(node) : '',
            query ? 'query' : '',
            `func ${name || ''}(${params.join(', ')})${returnString !== '()' ? ` : ${returnString}` : ''}`,
            `{ ${body || ''} };`,
        ];
    },
});
export default block;
