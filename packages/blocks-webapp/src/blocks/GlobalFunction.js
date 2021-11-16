import {boolType, effectType, identifierType, paramType} from '../block-types/types';
import {functionCategory} from '../block-categories/categories';
import {FiGlobe} from 'react-icons/fi';

// const defaultReturnType = unitType;
//
// function getGlobalFunctionReturnType(node, editor) {
//     let type = editor.compilers.type.getInput(node, 'body')?.generics[0] || defaultReturnType;
//     return asyncType.of(type);
// }

// TODO: dry with Function

const block = {
    title: 'Method',
    info: 'Define a callable method for the smart contract',
    category: functionCategory,
    icon: FiGlobe,
    topRight: 'body',
    // global: true,
    computeTitle(node, editor) {
        // return editor.compilers.motoko.getInput(node, 'name');
        let name = editor.compilers.motoko.getInput(node, 'name');
        let {params, body} = editor.compilers.motoko.getInputArgs(node);
        let returnType = editor.compilers.type.getInput(node, 'body')?.generics[0];
        if(!name && !params.length && !body) {
            return;
        }
        return `${name || ''}(${params.join(', ')})${returnType ? ' : ' + editor.compilers.motoko.getTypeString(returnType) : ''}`;
    },
    shortcuts: [{
        block: 'Return',
        connections: [{
            from: 'body',
            to: 'statement',
        }],
    }],
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
        optional: true,
    }],
    // outputs: [{
    //     key: 'caller',
    //     type: principalType,
    //     toMotoko(args, node, compiler) {
    //         return `${nodeIdentifierRef(node)}.caller`;
    //     },
    // }],
    controls: [{
        key: 'query',
        type: boolType,
    }],
};
export default block;
