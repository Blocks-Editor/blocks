import {
    asyncType,
    boolType,
    effectType,
    functionType, identifierType,
    paramType,
    principalType,
    tupleType,
    unitType,
} from '../block-types/types';
import {computeMemberName, memberBlock, visibilityControlProp} from '../block-patterns/member-patterns';
import {functionCategory} from '../block-categories/categories';
import nodeIdentifierRef from '../compilers/utils/nodeIdentifierRef';
import {FOR_BUILDING_API, FOR_REUSABLE_LOGIC} from '../editor/useCases';
import {formatParentheses, formatStatementBlock} from '../editor/format/formatHelpers';

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
    useCases: [FOR_BUILDING_API, FOR_REUSABLE_LOGIC],
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
            fromOutput: true,
            from: 'body',
            to: 'statement',
        }],
    }],
    inputs: [{
        key: 'name',
        type: identifierType,
    }, {
        key: 'params',
        title: 'Parameters',
        type: paramType,
        multi: true,
    }, {
        key: 'body',
        type: effectType,
        optional: true,
        request: true,
    }],
    outputs: [{
        key: 'caller',
        info: 'The remote principal which called this function',
        type: principalType,
        advanced: true,
        toMotoko(args, node, compiler) {
            return `${nodeIdentifierRef(node)}.caller`;
        },
    }, {
        key: 'function',
        info: 'The callable function value',
        type: functionType,
        advanced: true,
        inferType({params}, node, compiler) {
            const returnType = getFunctionReturnType(node, compiler.editor);
            return functionType.of(tupleType.of(...params), returnType);
        },
        toMotoko({name}) {
            return name;
        },
    }],
    controls: [
        visibilityControlProp(),
        {
            key: 'query',
            info: 'A query function runs faster but cannot modify state values',
            type: boolType,
            advanced: true,
        },
    ],
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
            `func ${name || ''}${formatParentheses(params.join(', '))}${returnString !== '()' ? ` : ${returnString}` : ''}`,
            formatStatementBlock(body || ''),
        ];
    },
});
export default block;
